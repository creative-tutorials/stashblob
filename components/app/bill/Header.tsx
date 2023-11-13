import Link from "next/link";
import Image from "next/image";
import LightImage from "@/public/assets/TransparentBlob White.png";
import DarkImage from "@/public/assets/TransparentBlob Color.png";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Command } from "lucide-react";
import { isMobile } from "react-device-detect";
import { useState, useEffect } from "react";
import { booleanType } from "@/types/appx";
import { CommandBx } from "../command-bx";

export default function Header() {
  const router = useRouter();
  const getPath = router.pathname;
  const [count, setCount] = useState(0);
  const [isMobileUse, setIsMobileUse] = useState(false);
  const [open, setOpen] = useState<booleanType>(false);

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && setIsMobileUse(isMobile);

    return () => {
      setCount(0);
    };
  }, [count]);

  return (
    <>
      <header className="fixed top-0 w-full z-10 md:p-3 md:px-10 lg:p-3 lg:px-10 p-4 bg-white/70 dark:bg-darkestbg/70 backdrop-blur-md border border-transparent border-b-whitebg dark:border-b-borderbtm flex items-center justify-between">
        <div className="">
          <Link href="/dashboard">
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
        </div>
        <nav className="flex items-center md:gap-4 lg:gap-4">
          {/* account */}
          {isMobileUse ? (
            <Command className="x mr-4" onClick={() => setOpen(!open)} />
          ) : (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-blackmid dark:text-lightgrey bg-transparent transition-colors hover:text-thirdprop hover:dark:text-white p-2 rounded-md"
              >
                Dashboard
              </Link>
              {getPath === "/billing" ? (
                <Link
                  href="/settings"
                  className="flex items-center gap-1 text-blackmid dark:text-lightgrey bg-transparent transition-colors hover:text-thirdprop hover:dark:text-white p-2 rounded-md"
                >
                  Settings
                </Link>
              ) : (
                getPath === "/settings" && (
                  <Link
                    href="/billing"
                    className="flex items-center gap-1 text-blackmid dark:text-lightgrey bg-transparent transition-colors hover:text-thirdprop hover:dark:text-white p-2 rounded-md"
                  >
                    Billing
                  </Link>
                )
              )}
            </>
          )}

          <UserButton />
        </nav>
      </header>
      <CommandBx open={open} setOpen={setOpen} />
    </>
  );
}
