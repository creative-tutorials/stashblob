
import { FileUp } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ChangeEvent } from "react";

type upxType = {
  uploadFile: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
}

export default function UploadSection({ uploadFile }:upxType) {
  return (
    <section className="mt-8">
      <article>
        <h3 className="text-blackmid dark:text-white md:text-2xl lg:text-2xl text-xl">
          Upload files
        </h3>
      </article>
      <Input
        id="upload-file"
        name="mega"
        type="file"
        accept="image/png, image/jpg, image/jpeg, image/avif, video/mp4"
        className="hidden"
        onChange={uploadFile}
      />
      <Label htmlFor="upload-file">
        <div className="cursor-pointer flex flex-col gap-4 items-center justify-center text-center border-2 border-dashed border-borderbtm/40 dark:border-containerBG p-4 transition-all rounded-lg hover:rounded mt-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full dark:bg-fileicon">
            <FileUp className="w-9 h-9 dark:text-darkerblue text-royalglue" />
          </div>

          <article className="flex flex-col gap-2">
            <p className="md:text-3xl lg:text-3xl text-xl font-normal dark:text-white text-blackmid">
              <span className="dark:text-gradedtext text-[#214fad]">Browse</span> File
            </p>
            <span className="md:text-sm lg:text-sm text-xs dark:text-hashtext text-darkbtn">
              Max: 20MB, Supports: PNG, JPEG, JPG, AVIF, MP4
            </span>
          </article>
        </div>
      </Label>
    </section>
  );
}