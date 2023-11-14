import { useRouter } from "next/router";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
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

import Loader from "@/components/app/Loader";

import { MoreHorizontal, Forward, Trash2 } from "lucide-react";

import { useUser } from "@clerk/nextjs";
import { useToast } from "../ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import { extension } from "@/types/appx";

type typeFile = {
  date: string;
  filename: string;
  filesize: number;
  filetype: number;
  uploadID: string;
  username: string;
};

type FileProp = {
  files: never[];
  dataLoading: boolean;
  isErr: boolean;
  fetchFiles(): Promise<void>;
  setShow: Dispatch<SetStateAction<boolean>>;
  setExtension: Dispatch<SetStateAction<extension>>;
  searchQ: string;
};

export default function Files({
  files,
  dataLoading,
  isErr,
  fetchFiles,
  setShow,
  setExtension,
  searchQ
}: FileProp) {
  const { toast } = useToast();
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const filteredFile = files.filter((file:typeFile) => {
    const lowercaseSearch = searchQ.toLowerCase()
    const lowercasedFilename = file.filename.toLowerCase();
    const uppercasedFilename = file.filename.toUpperCase();
    return lowercasedFilename.includes(lowercaseSearch) || uppercasedFilename.includes(lowercaseSearch);
  })

  const deleteFile = async (filename: string, uploadID: string) => {
    if (isSignedIn) {
      const id = user.id;
      const username = user.username;
      toast({
        description: "Please wait...",
      });
      axios
        .delete(`https://s-blob.vercel.app/delete/${filename}/${uploadID}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
            userid: id,
          },
        })
        .then(async function (response) {
          console.log(response.data);
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
    }
  };

  async function resetBilling(userid: string, username: string | null) {
    axios
      .post(
        "https://s-blob.vercel.app/reset/billing",
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
        console.log(response.data);
        await fetchFiles();
      })
      .catch(async function (error) {
        console.error(error);
      });
  }

  const OpenModal = async (filename: string, uploadID: string) => {
    setShow(true);
    setExtension((prev) => {
      return {
        ...prev,
        filename: filename,
        uploadID: uploadID,
      };
    });
  };

  return (
    <section className="flex flex-col gap-8 mt-8">
      <article>
        <h3 className="dark:text-white text-darkestbg md:text-2xl lg:text-2xl text-xl">
          Your files
        </h3>
      </article>
      {dataLoading ? (
        <Loader />
      ) : (
        <Table>
          {files.length !== 0 && isErr && (
            <TableCaption className="dark:text-lightgrey/70 text-darkestbg">
              A list of your uploaded files.
            </TableCaption>
          )}
          <TableHeader>
            <TableRow className="border border-transparent dark:border-b-borderbtm/80 border-b-hashtext dark:bg-[#282c34]/50 bg-white hover:dark:bg-[#282c34]/50 hover:bg-white">
              <TableHead className="dark:text-white">Name</TableHead>
              <TableHead className="dark:text-white">Type</TableHead>
              <TableHead className="dark:text-white">Size</TableHead>
              <TableHead className="dark:text-white">Created</TableHead>
              <TableHead className="dark:text-white"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFile.map((item: typeFile, index: number) => {
              return (
                <TableRow
                  key={item.uploadID}
                  className="cursor-pointer border border-transparent dark:border-b-borderbtm/80 border-b-hashtext dark:bg-[#282c34]/50 bg-white hover:dark:bg-[#282c34]/30 hover:bg-[#bfbfbf]/20"
                >
                  <TableCell
                    className="dark:text-midwhite2 text-blackmid dark:font-normal font-medium"
                    onClick={() =>
                      router.push(`/file/${item.uploadID}`)
                    }
                  >
                    {item.filename.substring(0, 10) + "..."}
                  </TableCell>
                  <TableCell
                    className="dark:text-midwhite2 text-blackmid dark:font-normal font-medium"
                    onClick={() =>
                      router.push(`/file/${item.uploadID}`)
                    }
                  >
                    {item.filetype}
                  </TableCell>

                  <TableCell
                    className="dark:text-midwhite2 text-blackmid dark:font-normal font-medium"
                    onClick={() =>
                      router.push(`/file/${item.uploadID}`)
                    }
                  >
                    {item.filesize}
                  </TableCell>
                  <TableCell
                    className="dark:text-midwhite2 text-blackmid dark:font-normal font-medium"
                    onClick={() =>
                      router.push(`/file/${item.uploadID}`)
                    }
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
                            Share{" "}
                            <Forward className="w-4 h-4" />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="p-3 bg-transparent transition-colors hover:bg-[#bfbfbf]/30 hover:dark:bg-hovergrey cursor-pointer select-none rounded-md text-blackmid dark:text-midwhite border-none outline-none flex items-center justify-between gap-2"
                            onClick={() =>
                              deleteFile(item.filename, item.uploadID)
                            }
                          >
                            Delete <Trash2 className="w-4 h-4" />
                          </DropdownMenuItem>
                        </nav>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
