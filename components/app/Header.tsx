import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { typeUpldState } from "@/types/appx";

type HeaderProp = {
  uploadFile: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  setOpen: Dispatch<SetStateAction<boolean>>
  open: boolean
  uploadState: typeUpldState
}

export default function Header({ uploadFile, setOpen, open, uploadState }:HeaderProp) {
  return (
    <header className="fixed top-0 w-full z-10 md:p-3 md:px-10 lg:p-3 lg:px-10 p-4 bg-darkestbg/70 backdrop-blur-md border border-transparent border-b-borderbtm flex items-center justify-between">
      <div className="">
        <Link href="/dashboard">
          <Image
            src="/assets/TransparentBlob White.png"
            width={150}
            height={42}
            placeholder="blur"
            className="md:w-[150px] lg:w-[150px] w-[120px]"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
            alt="forget logo"
          />
        </Link>
      </div>
      <nav className="flex items-center md:gap-4 lg:gap-4 gap-1">
        {/* account */}
        <Input
          id="upload-file"
          name="mega"
          type="file"
          accept="image/png, image/jpg, image/jpeg, image/avif, video/mp4"
          className="hidden"
          onChange={uploadFile}
        />
        <Label
          htmlFor="upload-file"
          className={`${
            uploadState.isUploading
              ? "bg-royalblue/30 p-2 px-4 pointer-events-none border border-blueborder rounded text-white flex items-center gap-1"
              : "md:bg-royalblue lg:bg-royalblue bg-transparent md:transition-colors lg:transition-colors md:hover:bg-royalblue/60 lg:hover:bg-royalblue/60 p-2 px-4 cursor-pointer border md:border-blueborder/20 lg:border-blueborder/20 border-transparent rounded text-white flex items-center gap-1"
          }`}
        >
          <UploadCloud className="md:w-auto md:h-auto lg:w-auto lg:h-auto w-6 h-6" />{" "}
          <span className="md:block lg:block hidden">
            {uploadState.isUploading
              ? uploadState.props.uploading
              : uploadState.props.upload}
          </span>
        </Label>
        <Button
          className="bg-white hover:bg-midwhite text-darkestbg rounded md:flex lg:flex hidden items-center gap-1"
          onClick={() => setOpen(!open)}
        >
          Menu
        </Button>
        <UserButton />
      </nav>
    </header>
  );
}