import { FileUp, File } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ChangeEvent, Suspense } from "react";
import { useState, useEffect, useRef } from "react";

type upxType = {
  uploadFile: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
};

export function UploadSection({ uploadFile, isUploading }: upxType) {
  const [progress, setProgress] = useState(0);
  // let progress = 0;
  const timer: any = useRef();
  const [files, setFiles] = useState({
    filename: "Loading.png",
  });
  // let timer:any = "";
  useEffect(() => {
    if (isUploading) {
      timer.current = setTimeout(() => setProgress((prev) => prev + 10), 1200);
      if (progress === 80) {
        clearInterval(timer.current);
      } else if (!isUploading) {
        setProgress(100);
        clearInterval(timer.current);
      }
    } else {
      return;
    }

    return () => {
      clearInterval(timer);
    };
  }, [progress, isUploading]);

  return (
    <section className="mt-8">
      <article>
        <h3 className="text-blackmid font-medium dark:text-white md:text-2xl lg:text-2xl text-xl">
          Upload files
        </h3>
      </article>
      {isUploading ? (
        <Suspense fallback={<p>Loading...</p>}>
          {isUploading ? (
            <UploadState progress={progress} filename={files.filename} />
          ) : null}
        </Suspense>
      ) : (
        <>
          <Input
            id="upload-file"
            name="mega"
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/avif, video/mp4"
            className="hidden"
            onChange={(e) => {
              uploadFile(e);
              // filename
              const filename = e.target.files?.[0].name as string;
              setFiles({ ...files, filename: filename });
              setProgress(0);
            }}
          />
          <Label htmlFor="upload-file">
            <div className="cursor-pointer flex flex-col gap-4 items-center justify-center text-center border-2 border-dashed border-borderbtm/40 dark:border-purplebtn p-4 transition-all rounded-lg hover:rounded mt-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full">
                <FileUp className="w-9 h-9 text-purplebtn" />
              </div>

              <article className="flex flex-col gap-2">
                <p className="md:text-3xl lg:text-3xl text-xl font-medium dark:text-white text-blackmid">
                  <span className="text-purplebtn">Browse</span> File
                </p>
                <span className="md:text-sm lg:text-sm text-xs dark:text-hashtext text-darkbtn">
                  Max: 20MB, Supports: PNG, JPEG, JPG, AVIF, MP4
                </span>
              </article>
            </div>
          </Label>
        </>
      )}
    </section>
  );
}

function UploadState(props: { filename: string; progress: number }) {
  return (
    <div className="w-full p-4 transition-all mt-4 flex items-start gap-3">
      <div className="">
        <File className="md:w-20 md:h-20 lg:w-20 lg:h-20 w-10 h-10 text-darkbtn" />
      </div>
      <div id="file" className="flex flex-col gap-2 w-full">
        <span id="filename">{props.filename}</span>
        <span className="text-lg">{props.progress}%</span>
        <span
          id="progress-wrapper"
          className="w-full h-2 relative rounded bg-linkppl"
        >
          <span
            id="progress"
            style={{
              width: props.progress + "%",
              transition: "ease-in-out 0.5s",
            }}
            className={`h-2 transition-all absolute top-0 left-0 bg-purplebtn rounded`}
          ></span>
        </span>
      </div>
    </div>
  );
}
