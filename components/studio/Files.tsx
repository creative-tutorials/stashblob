import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { APIURL } from "@/config/apiurl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { FilesPagination } from "./files/pagination";

import Loader from "@/components/app/Loader";

import { MoreHorizontal, Forward, Trash2, Copy } from "lucide-react";

import { useUser } from "@clerk/nextjs";
import { useToast } from "../ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import { cacheFile } from "@/class/cache-file";
import { extension } from "@/class/extension";
import { typeFile } from "@/types/appx";
import { PickFileKV } from "@/types/appx";

type FileProp = {
  files: never[];
  fetchFiles(): Promise<void>;
  states: {
    dataLoading: boolean;
    setIsFinished?: Dispatch<SetStateAction<boolean>> | any;
    setIsLoading?: Dispatch<SetStateAction<boolean>> | any;
    setShow: Dispatch<SetStateAction<boolean>>;
    setIsShown?: Dispatch<SetStateAction<boolean>> | any;
  };
};

export function Files({ files, fetchFiles, states }: FileProp) {
  const { toast } = useToast();
  const { isSignedIn, user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const router = useRouter();
  const { query } = router.query;
  const { folderid } = router.query;
  const getPath = router.asPath;

  const filteredFile = files.filter((file: typeFile) => {
    if (query !== undefined) {
      const filtered = query as string;
      const lowercaseSearch = filtered.toLowerCase();
      const lowercasedFilename = file.filename.toLowerCase();
      const uppercasedFilename = file.filename.toUpperCase();
      return (
        lowercasedFilename.includes(lowercaseSearch) ||
        uppercasedFilename.includes(lowercaseSearch)
      );
    }
    return;
  });

  const GetLength = () => {
    if (query !== undefined) {
      return filteredFile.length;
    }
    return files.length;
  };

  const paginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (query !== undefined) {
      return filteredFile.slice(startIndex, endIndex);
    }
    return files.slice(startIndex, endIndex);
  };

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const deleteFile = async (filename: string, uploadID: string) => {
    if (isSignedIn) {
      if (!states.dataLoading) {
        const id = user?.id;
        const username = user?.username;
        toast({
          description: "Please wait...",
        });
        axios
          .delete(`${APIURL}/delete/${filename}/${uploadID}`, {
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_API_KEY,
              userid: id,
              folderid: folderid,
            },
          })
          .then(async function (response) {
            toast({
              title: "Success",
              description: response.data.message,
            });
            await resetBilling(id, username);
          })
          .catch(async function (error) {
            console.error(error.response);
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          });
      } else {
        toast({
          description: "Please wait...",
        });
      }
    }
  };

  async function resetBilling(userid: string, username: string | null) {
    axios
      .post(
        `${APIURL}/reset/billing`,
        {
          userid: userid,
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      )
      .then(async function (response) {
        await fetchFiles();
      })
      .catch(async function (error) {
        console.error(error);
      });
  }

  const OpenModal = async (filename: string, uploadID: string) => {
    states.setShow(true);
    extension.filename = filename;
    extension.uploadID = uploadID;
  };

  const trackAndStoreFile = async function (
    uploadID: string,
    userid: string | undefined
  ) {
    if (getPath === `/folder/${folderid}`) {
      return;
    } else {
      states.setIsLoading(true);
      states.setIsFinished(false);
    }
    if (!isSignedIn) {
      return;
    } else {
      axios
        .post(
          `${APIURL}/track/file/${uploadID}/${userid}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_API_KEY,
            },
          }
        )
        .then(async function (response) {
          const fileObj: PickFileKV = response.data.data;
          cacheFile.date = fileObj.date;
          cacheFile.filename = fileObj.filename;
          cacheFile.filesize = fileObj.filesize;
          cacheFile.filetype = fileObj.filetype;
          cacheFile.uploadID = fileObj.uploadID;
          if (getPath === `/folder/${folderid}`) {
            return;
          } else {
            states.setIsFinished(true);
            states.setIsLoading(false);
          }
          await openModal();
        })
        .catch(async function (error) {
          console.error(error.response);
          if (getPath === `/folder/${folderid}`) {
            return;
          } else {
            states.setIsLoading(false);
            states.setIsFinished(false);
          }

          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.response.data.error,
          });
        });
    }
  };

  async function openModal() {
    if (getPath === `/folder/${folderid}`) {
      return;
    } else {
      states.setIsShown(true);
    }
  }

  return (
    <section className="flex flex-col gap-8 mt-8">
      <article className="flex gap-2 flex-col">
        <h3 className="dark:text-white text-darkestbg md:text-2xl lg:text-2xl text-xl font-medium">
          Files
        </h3>
        <span className="dark:text-hashtext text-darkbtn">
          These are the list of files uploaded by you
        </span>
      </article>
      {states.dataLoading ? (
        <Loader />
      ) : (
        <>
          <Table className=" whitespace-nowrap overflow-auto">
            <TableHeader>
              <TableRow className="border border-transparent dark:border-b-borderbtm/80 border-b-hashtext ">
                <TableHead className="dark:text-white">Name</TableHead>
                <TableHead className="dark:text-white">Size</TableHead>
                <TableHead className="dark:text-white">Uploaded</TableHead>
                <TableHead className="dark:text-white"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {paginatedData().map((item: typeFile, index: number) => {
                return (
                  <TableRow
                    key={item.uploadID}
                    className="cursor-pointer border border-transparent dark:border-b-borderbtm/80 border-b-hashtext hover:dark:bg-[#282c34]/30 hover:bg-[#bfbfbf]/20"
                  >
                    <TableCell
                      className="dark:text-midwhite2 text-blackmid dark:font-normal font-medium"
                      onClick={() => router.push(`/file/${item.uploadID}`)}
                      title={item.filename}
                    >
                      {item.filename.substring(0, 10) + "..."}
                    </TableCell>

                    <TableCell
                      className="dark:text-midwhite2 text-blackmid dark:font-normal font-medium"
                      onClick={() => router.push(`/file/${item.uploadID}`)}
                    >
                      {item.filesize}
                    </TableCell>

                    <TableCell
                      className="dark:text-midwhite2 text-blackmid dark:font-normal font-medium"
                      onClick={() => router.push(`/file/${item.uploadID}`)}
                    >
                      {item.date}
                    </TableCell>

                    <TableCell
                      className="flex gap-3"
                      onClick={(e) => e.preventDefault()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <MoreHorizontal className="cursor-pointer w-4 h-4 dark:text-white text-black" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="dark:bg-[#111213] bg-white shadow-lg dark:shadow-none border border-[#bfbfbf] dark:border-hovergrey p-4 w-48 rounded-md">
                          <nav className="flex flex-col gap-2">
                            <DropdownMenuItem
                              className="p-3 bg-transparent transition-colors hover:bg-[#bfbfbf]/30 hover:dark:bg-hovergrey cursor-pointer select-none rounded-md text-blackmid dark:text-midwhite border-none outline-none flex items-center justify-between gap-2"
                              onClick={() =>
                                OpenModal(item.filename, item.uploadID)
                              }
                            >
                              Share <Forward className="w-4 h-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="p-3 bg-transparent transition-colors hover:bg-[#bfbfbf]/30 hover:dark:bg-hovergrey cursor-pointer select-none rounded-md text-blackmid dark:text-midwhite border-none outline-none flex items-center justify-between gap-2"
                              onClick={() =>
                                deleteFile(item.filename, item.uploadID)
                              }
                            >
                              Delete <Trash2 className="w-4 h-4" />
                            </DropdownMenuItem>
                            {getPath === `/folder/${folderid}` ? null : (
                              <DropdownMenuItem
                                className="p-3 bg-transparent transition-colors hover:bg-[#bfbfbf]/30 hover:dark:bg-hovergrey cursor-pointer select-none rounded-md text-blackmid dark:text-midwhite border-none outline-none flex items-center justify-between gap-2"
                                onClick={() =>
                                  trackAndStoreFile(item.uploadID, user?.id)
                                }
                              >
                                Copy to folder <Copy className="w-4 h-4" />
                              </DropdownMenuItem>
                            )}
                          </nav>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <FilesPagination
            length={{ GetLength, currentPage, pageSize }}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
