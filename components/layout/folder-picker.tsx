import axios from "axios";
import { APIURL } from "@/config/apiurl";
import { EventProp } from "@/class/events";
import { cacheFile } from "@/class/cache-file";
import { PickFileKV, PickerProp, typeFolder } from "@/types/appx";
import { useState, useEffect, Fragment } from "react";
import { booleanType } from "@/types/appx";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SpinLoader } from "@/components/app/animation/spin-loader";
import { ChevronsUpDown, Loader2, X } from "lucide-react";

export function FolderPicker({ states }: PickerProp) {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState<booleanType>(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isSignedIn, user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    setCount((prev) => prev + 1);

    const getAllFolders = async () => {
      setIsLoading(true);
      EventProp.event2 = true;
      if (!isSignedIn) {
        return;
      } else {
        const userID = user?.id;
        axios
          .get(`${APIURL}/all/folder`, {
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_API_KEY,
              owner: userID,
            },
          })
          .then(async function (response) {
            states.setFolders(response.data);
            setIsLoading(false);
            EventProp.event2 = false;
          })
          .catch(async function (error) {
            setIsLoading(false);
            EventProp.event2 = false;
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: error.response.data.error,
            });
          });
      }
    };

    count === 1 && getAllFolders();

    return () => {
      setCount(0);
    };
  }, [count, isSignedIn, user?.id]);

  async function moveFileToFolder(
    file: PickFileKV,
    folderID: string,
    folderName: string
  ) {
    setIsLoading(true);
    if (!isSignedIn) {
      return;
    } else {
      const userid = user?.id;
      axios
        .post(
          `${APIURL}/move/file/${folderID}/${folderName}`,
          {
            uploadID: file.uploadID,
            filename: file.filename,
            filesize: file.filesize,
            filetype: file.filetype,
            date: file.date,
          },
          {
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_API_KEY,
              userid: userid,
            },
          }
        )
        .then(async function (response) {
          // log the response
          // console.log(response.data);
          states.setIsShown(false);
          setIsLoading(false);
          toast({
            title: "Success!",
            description: response.data.data,
          });
        })
        .catch(async function (error) {
          console.error(error.response);
          setIsLoading(false);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.response.data.error,
          });
        });
    }
  }

  return (
    <div
      className={`w-full h-full fixed top-0 left-0 p-3 dark:bg-darkestbg/80 bg-white/80 backdrop-blur-md transition-all ${
        states.isShown
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } flex items-center justify-center min-h-screen`}
      id="file-popup"
    >
      <div
        className="md:p-4 lg:p-4 p-3 w-full md:max-w-fit lg:max-w-fit dark:bg-darkmxbtn/50 dark:border dark:border-darkbtn/30 bg-[#ffffff] border border-borderbtm/20 rounded-md shadow-md"
        id="popup-wrapper"
      >
        <div className="flex items-end justify-end" id="close">
          <X
            className="h-5 w-5 cursor-pointer"
            onClick={() => states.setIsShown(false)}
          />
        </div>
        <div id="gg">
          <hgroup className="flex flex-col gap-3">
            <h3 className="text-2xl font-semibold">Move file </h3>
            <span className="x pl-2 border-2 border-transparent dark:border-l-linkclr border-l-royalblue">
              Select a folder you would like to move your file to.
            </span>
          </hgroup>
          <div
            className="mt-4 w-full border border-hashtext/30 md:p-4 lg:p-4 p-2 rounded-md"
            id="folderGroup"
          >
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="md:w-[350px] lg:w-[350px] w-full space-y-2"
            >
              <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">Select a folder</h4>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:w-9 lg:w-9 p-0 border border-transparent"
                  >
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              {isLoading ? (
                <>
                  <SpinLoader asChild={<Loader2 className="animate-spin" />} />
                </>
              ) : (
                <>
                  {states.folders.map((item: typeFolder, index) => {
                    return (
                      <Fragment key={index}>
                        <CollapsibleContent className="space-y-2">
                          <Button
                            className="rounded-md w-full border transition-all hover:dark:bg-darkbtnhover hover:bg-hashtext/10 dark:border-darkbtn border-borderbtm/30 hover:dark:text-white hover:text-thirdprop hover:border-transparent px-4 py-3 text-sm cursor-pointer"
                            onClick={() =>
                              moveFileToFolder(
                                cacheFile,
                                item.folderID,
                                item.folderName
                              )
                            }
                          >
                            {item.folderName}
                          </Button>
                        </CollapsibleContent>
                      </Fragment>
                    );
                  })}
                </>
              )}
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
