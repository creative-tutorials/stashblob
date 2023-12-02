import Head from "next/head";
import axios from "axios";
import { APIURL } from "@/config/apiurl";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, ChangeEvent, Fragment, Suspense } from "react";
import { useUser } from "@clerk/nextjs";

import { CommandBx } from "@/components/app/command-bx";
import { Folders } from "@/components/layout/folders";
import { CreateFolder } from "@/components/layout/create-folder";

import { Header } from "@/components/app/Header";
import { ModalUI } from "@/components/app/modal-ui";

import { PackageOpen } from "lucide-react";
import { TriangleLoad } from "@/components/app/animation/triangle-loader";
import { OvalLoader } from "@/components/app/animation/oval-loader";

import { UploadSection } from "@/components/studio/upload-section";
import { Files } from "@/components/studio/Files";
import { FolderPicker } from "@/components/layout/folder-picker";

import { EventProp } from "@/class/events";
import {
  supaType,
  typeUpldState,
  typeCounter,
  booleanType,
} from "@/types/appx";

const supabaseProp: supaType = {
  projectURL: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  public_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  bucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET as string,
  folder: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_FOLDER as string,
};

const supabase = createClient(
  supabaseProp.projectURL,
  supabaseProp.public_anon_key
);

export default function Dashboard() {
  const { toast } = useToast();
  const { isLoaded, isSignedIn, user } = useUser();
  const [open, setOpen] = useState<booleanType>(false);
  const [isShown, setIsShown] = useState<booleanType>(false);
  const [show, setShow] = useState<booleanType>(false);
  const [files, setFiles] = useState([]);
  const [uploadState, setUploadState] = useState<typeUpldState>({
    isUploading: false,
    props: {
      uploading: "Uploading....",
      upload: "Upload",
    },
  });
  const [dataLoading, setDataLoading] = useState<booleanType>(false);
  const [isFinished, setIsFinished] = useState<booleanType>(false);
  const [isDone, setIsDone] = useState<booleanType>(false);
  const [folders, setFolders] = useState([]);
  const [isErr, setIsErr] = useState<booleanType>(false);
  const [isFolded, setIsFolded] = useState<booleanType>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState<typeCounter>(0);

  useEffect(() => {
    setCounter((prev) => prev + 1);

    counter === 1 && fetchFiles();

    return () => {
      setCounter(0);
    };
  }, [counter, isSignedIn]);

  async function fetchFiles() {
    setIsDone(false);
    setIsErr(false);
    setDataLoading(true);
    EventProp.event1 = true;
    if (isSignedIn) {
      const id = user.id;
      axios
        .get(`${APIURL}/files/${id}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        .then(async function (response) {
          setFiles(response.data);
          setIsErr(false);
          setDataLoading(false);
          setIsDone(true);
          EventProp.event1 = false;
        })
        .catch(async function (error) {
          console.error(error.response);
          setIsErr(true);
          setDataLoading(false);
          EventProp.event1 = false;
          setIsDone(true);
          setFiles([]);
        });
    }
  }

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const filename = file?.name;
    const fileSize = file?.size;
    const fileType = file?.type;

    if (!file) {
      console.log("No file selected!");
      setUploadState((prev) => {
        return {
          ...prev,
          isUploading: false,
        };
      });
    } else {
      console.info("waiting...");
      setUploadState((prev) => {
        return {
          ...prev,
          isUploading: true,
        };
      });
      toast({
        description: "Uploading...",
      });
      // 1. create draft billing record
      await createBillingDraft(file, filename, fileSize, fileType, event)
        .then(async function (data) {
          console.log("bill intiated");
          toast({
            description: "Uploading...",
          });
        })
        .catch(async function (error) {
          console.error("bill error", error);
          setUploadState((prev) => {
            return {
              ...prev,
              isUploading: true,
            };
          });
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        });
    }
  };

  async function createBillingDraft(
    file: File,
    filename: string | undefined,
    fileSize: number | undefined,
    fileType: string | undefined,
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (!isLoaded || !isSignedIn) {
      return null;
    } else {
      axios
        .post(
          `${APIURL}/initiate/billing`,
          {
            userid: user.id,
            username: user.username,
          },
          {
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_API_KEY,
            },
          }
        )
        .then(async function (response) {
          await intializeUpload(file, filename, fileSize, fileType, event)
            .then(async function (data) {
              console.info("upload intialized");
              toast({
                description: "Uploading...",
              });
            })
            .catch(async function (error) {
              event.target.value = "";
              console.error("err from intializeUpload", error);
              toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
              });
            });
          return "bill intiated";
        })
        .catch(async function (error) {
          console.error(error.response);
          throw new Error("failed to bill");
        });
    }
  }

  async function intializeUpload(
    file: File,
    filename: string | undefined,
    fileSize: number | undefined,
    fileType: string | undefined,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const getFile = file;
    const { data, error } = await supabase.storage
      .from(supabaseProp.bucket)
      .upload(`${supabaseProp.folder}/${filename}`, getFile, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) {
      setUploadState((prev) => {
        return {
          ...prev,
          isUploading: false,
        };
      });
      throw new Error(error.message);
    } else {
      await uploadFileDB(filename, fileSize, fileType, event)
        .then(async function (data) {
          console.info("uploading...");
          toast({
            description: "Uploading...",
          });
        })
        .catch(async function (error) {
          console.error(error);
        });
    }
  }

  async function uploadFileDB(
    name: string | undefined,
    size: number | undefined,
    type: string | undefined,
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (!isLoaded || !isSignedIn) {
      return null;
    } else {
      axios
        .post(
          `${APIURL}/upload`,
          {
            filename: name,
            size: size,
            type: type,
            userid: user.id,
            username: user.username,
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
          setUploadState((prev) => {
            return {
              ...prev,
              isUploading: false,
            };
          });
          toast({
            title: "Success",
            description: response.data.message,
          });

          await fetchFiles();
          event.target.value = "";
          return response.data.message;
        })
        .catch(async function (error) {
          console.error(error.response);
          setUploadState((prev) => {
            return {
              ...prev,
              isUploading: false,
            };
          });
          toast({
            variant: "destructive",
            title: "Error",
            description: "err",
          });
          event.target.value = "";
          return error.response;
        });
    }
  }

  return (
    <>
      <Head>
        <title>StashBlob | Search</title>
        <meta
          name="description"
          content="Search for files without leaving the app, everything is fast."
        />
        <meta
          name="keywords"
          content="Cloud Storage, File Sharing, Storage Bucket, Dropbox, StashBlob"
        />
        <meta
          name="google-site-verification"
          content="l1a2fyP4jz21WqSIR2HNxLAyt__hUNkV-48f_zbVHYE"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:url" content="https://stashblobweb.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="StashBlob | Search" />
        <meta
          property="og:description"
          content="Search for files without leaving the app, everything is fast."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/derbreilm/image/upload/v1700921113/Site_Rollup_pk7dop.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="stashblobweb.vercel.app" />
        <meta
          property="twitter:url"
          content="https://stashblobweb.vercel.app"
        />
        <meta name="twitter:title" content="StashBlob | Search" />
        <meta
          name="twitter:description"
          content="Search for files without leaving the app, everything is fast."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/derbreilm/image/upload/v1700921113/Site_Rollup_pk7dop.jpg"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=2"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=2"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=2"
        />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
      </Head>
      <div className="">
        <Header setOpen={setOpen} open={open} />
        <main>
          <div className="md:p-10 lg:p-10 md:px-14 lg:px-14 p-4 md:mt-14 lg:mt-14 mt-20">
            <div className="mt-2">
              <section>
                <article className="flex flex-col gap-2">
                  <h3 className="dark:text-white text-blackmid md:text-2xl lg:text-2xl text-xl font-medium">
                    Folders
                  </h3>
                  <CreateFolder setFolders={setFolders} />
                  <Separator className="my-4 dark:bg-darkbtn bg-borderbtm/40" />
                  <Suspense fallback={<p>Loading...</p>}>
                    {isDone ? (
                      <Folders
                        setFolders={setFolders}
                        folders={folders}
                        setIsFolded={setIsFolded}
                      />
                    ) : (
                      <TriangleLoad />
                    )}
                  </Suspense>
                </article>
              </section>
              <Separator className="my-4 dark:bg-darkbtn bg-borderbtm/40" />
              <UploadSection
                uploadFile={uploadFile}
                isUploading={uploadState.isUploading}
              />
              <Separator className="my-4 dark:bg-darkbtn bg-borderbtm/40" />
              <Suspense fallback={<p>Loading...</p>}>
                <Files
                  files={files}
                  fetchFiles={fetchFiles}
                  states={{
                    dataLoading,
                    setIsFinished,
                    setIsLoading,
                    setShow,
                    setIsShown,
                  }}
                />
              </Suspense>
            </div>

            <Fragment>
              {files.length === 0 && isErr && (
                <div className="mt-8 flex flex-col items-center justify-center">
                  <div>
                    <PackageOpen className="w-20 h-20 text-whiteos" />
                  </div>
                  <hgroup className="text-center flex-col">
                    <h2 className="text-2xl dark:text-white text-protbg">
                      No files uploaded yet
                    </h2>
                    <span className="text-sm text-white/30 text-protbg">
                      Upload some files to get started!
                    </span>
                  </hgroup>
                </div>
              )}
            </Fragment>
          </div>
        </main>
        <CommandBx open={open} setOpen={setOpen} />
        <ModalUI show={show} setShow={setShow} />
        <Suspense fallback={<p>Loading...</p>}>
          {isDone && isFolded && isFinished ? (
            <FolderPicker
              states={{
                setIsShown,
                isShown,
                setFolders,
                folders,
              }}
            />
          ) : null}
        </Suspense>
        {isLoading && (
          <div className="w-full h-full fixed top-0 left-0 bg-thirdprop/60 flex items-center justify-center">
            <OvalLoader />
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
}
