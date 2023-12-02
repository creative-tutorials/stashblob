import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { BillBreak } from "@/types/appx";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Settings, ActivitySquare, FileText } from "lucide-react";

export function BillingBrk(props: BillBreak) {
  return (
    <section>
      <hgroup className="flex flex-col gap-2">
        <p className="text-2xl font-medium">Billing breakdown</p>
        <span className="dark:text-hashtext text-borderbtm">
          Manage your storage space and usage. Find out more about what
          you&apos;ve used <br /> and how much you&apos;re paying.
        </span>
      </hgroup>
      <hgroup className="mt-4">
        <p className="text-xl font-medium">Your Storage</p>
      </hgroup>
      <Link
        href="/billing"
        className="flex flex-col gap-4 p-4 dark:bg-darkmdc border dark:border-borderbtm bg-hashtext/10 border-darkbtn/30 w-full max-w-md rounded mt-4"
      >
        <div id="box-status" className="">
          <div id="storage-space" className="flex flex-col gap-4">
            <div id="text-and-icon" className="flex justify-between">
              <hgroup>
                <h2 className="text-2xl font-medium">
                  Storage{" "}
                  <span className="text-sm dark:text-[#b58dde] text-[#3c096c]">
                    {"stashblob-1"}
                  </span>
                </h2>
              </hgroup>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Settings
                    className="w-5 h-5 dark:text-hashtext text-darkbtn cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-[#111213] bg-white shadow-lg dark:shadow-none border border-[#bfbfbf] dark:border-hovergrey p-4 w-48 rounded-md">
                  <DropdownMenuLabel>App Info</DropdownMenuLabel>
                  <Input
                    type="text"
                    placeholder="Email"
                    className="opacity-0 pointer-events-none h-[0rem]"
                    autoFocus
                    onKeyUp={(e) => {
                      // if key ctrl key and s key is pressed
                      e.preventDefault();

                      if (e.ctrlKey && e.key === "s") {
                        props.router.push("/status");
                      } else if (e.ctrlKey && e.key === "d") {
                        props.router.push("/docs");
                      }
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                  <DropdownMenuSeparator className="w-full h-[0.01rem] dark:bg-borderbtm bg-hashtext" />
                  <DropdownMenuGroup className="mt-4">
                    <Link href="/status">
                      <DropdownMenuItem className="p-4 rounded-md focus:bg-darkbtnhover/50 cursor-pointer flex items-center outline-none">
                        <ActivitySquare className="mr-2 h-4 w-4" />
                        <span>Status</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/docs">
                      <DropdownMenuItem className="p-4 rounded-md focus:bg-darkbtnhover/50 cursor-pointer flex items-center outline-none">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Docs</span>
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div id="storage-cap">
              <p className="text-xl font-medium">
                {props.totalString}{" "}
                {props.loading ? (
                  <span className="text-sm dark:text-whitebg/80 text-darkbtn">
                    Loading...
                  </span>
                ) : (
                  <span className="text-sm dark:text-whitebg/80 text-darkbtn">{`(${props.used}%)`}</span>
                )}
              </p>
            </div>
            <div className="flex gap-4">
              <Badge className="dark:bg-[#e5ccfc] bg-[#ebd7ff] text-[#642CA9] text-base rounded-lg font-medium hover:dark:bg-[#f5eaff] hover:bg-[#e9d1ff]">
                Free
              </Badge>
              <Badge className="dark:bg-[#e5ccfc] bg-[#ebd7ff] text-[#642CA9] text-base rounded-lg font-medium hover:dark:bg-[#f5eaff] hover:bg-[#e9d1ff]">
                Downtime Reports
              </Badge>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
