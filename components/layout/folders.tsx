import axios from "axios";
import { APIURL } from "@/config/apiurl";
import Link from "next/link";
import { TailSpin } from "react-loader-spinner";
import { Fragment, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";

import { PropFolders } from "@/types/appx";
import { typeFolder } from "@/types/appx";

export function Folders({ setFolders, folders, setIsFolded }: PropFolders) {
  const [count, setCount] = useState(0);
  const [isErr, setIsErr] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const { isSignedIn, user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    setCount((prev) => prev + 1);

    const getAllFolders = async () => {
      setIsErr(false);
      setIsFolded(false);
      setDataLoading(true);
      localStorage.setItem("pf2", "true");
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
            setFolders(response.data);
            setIsErr(false);
            setIsFolded(true);
            setDataLoading(false);
            localStorage.setItem("pf2", "false");
          })
          .catch(async function (error) {
            console.error(error.response);
            setIsErr(true);
            setIsFolded(false);
            setDataLoading(false);
            localStorage.setItem("pf2", "false");
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

  return (
    <div
      id="folders"
      className="flex items-center w-full gap-6 max-w-lg overflow-auto p-4"
    >
      {isErr ? (
        <p>No folder found</p>
      ) : (
        <>
          {dataLoading ? (
            <TailSpin
              height="80"
              width="80"
              color="#6f2dbd"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          ) : (
            <>
              {folders.map((item: typeFolder, index: number) => {
                return (
                  <Fragment key={index}>
                    <Link href={`/folder/${item.folderID}`} key={item.folderID}>
                      <div
                        id="folder"
                        className="cursor-pointer text-center hover:underline hover:text-purupleg2"
                      >
                        <div id="folderIcon">
                          <svg
                            width="54"
                            height="54"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="#6f2dbd"
                              d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.588 1.413T20 20H4Z"
                            />
                          </svg>
                        </div>
                        <hgroup>
                          <h3 className="whitespace-nowrap font-medium">
                            {item.folderName}
                          </h3>
                        </hgroup>
                      </div>
                    </Link>
                  </Fragment>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
}
