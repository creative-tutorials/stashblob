import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud, Command, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import { Dispatch, SetStateAction, useState, useEffect } from "react";

import { EventProp } from "@/class/events";
import LightImage from "@/public/assets/TransparentBlob White.png";
import DarkImage from "@/public/assets/TransparentBlob Color.png";

type HeaderProp = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
};

export function Header({ setOpen, open }: HeaderProp) {
  const [count, setCount] = useState(0);
  const [isMobileUse, setIsMobileUse] = useState(false);
  const [textVal, setTextVal] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && setIsMobileUse(isMobile);

    return () => {
      setCount(0);
    };
  }, [count]);

  return (
    <header className="fixed top-0 w-full z-10 md:p-3 md:px-10 lg:p-3 lg:px-10 p-4 bg-white/30 dark:bg-darkestbg/70 backdrop-blur-md border border-transparent border-b-borderbtm/20 dark:border-b-borderbtm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="">
          <Image
            src={DarkImage}
            width={150}
            height={42}
            placeholder="blur"
            className="md:w-[150px] lg:w-[150px] w-[120px] block dark:hidden"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
            alt="forget logo"
          />
          <Image
            src={LightImage}
            width={150}
            height={42}
            placeholder="blur"
            className="md:w-[150px] lg:w-[150px] w-[120px] hidden dark:block"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
            alt="forget logo"
          />
        </Link>
        {isMobileUse ? null : (
          <span className="relative md:block lg:block hidden">
            <Search className="w-4 h-4 absolute top-3 left-3 dark:text-hashtext text-blackmid" />
            <Input
              type="text"
              placeholder="Search drive"
              className="border-2 border-transparent w-96 p-4 px-10 dark:bg-[#282a2f] bg-hashtext/30 focus:bg-transparent focus:border-elemgf placeholder:dark:text-midwhite placeholder:text-blackmid"
              disabled={EventProp.event1 === true || EventProp.event2 === true}
              onChange={(e) => {
                setTextVal(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  console.log(textVal);
                  router.push(`/dashboard/${textVal}`);
                }
              }}
            />
          </span>
        )}
      </div>
      <nav className="flex items-center md:gap-4 lg:gap-4 gap-3">
        {isMobileUse ? (
          <Command className="cursor-pointer" onClick={() => setOpen(!open)} />
        ) : (
          <Button
            className="bg-hashtext/50 dark:bg-darkbtn hover:bg-hashtext/60 hover:dark:bg-borderbtm text-blackmid dark:text-white rounded items-center gap-1"
            onClick={() => setOpen(!open)}
          >
            Menu
          </Button>
        )}
        <UserButton />
      </nav>
    </header>
  );
}
