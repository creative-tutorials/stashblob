import { useRouter } from "next/router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

type CommandProp = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function CommandBx({ open, setOpen }: CommandProp) {
  const router = useRouter();
  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          className="dark:text-white text-blackmid"
          onKeyUp={(e) => {
            // prevent default key action
            e.preventDefault();
            // if ctrl and b
            if (e.ctrlKey && e.key === "b") {
              router.push("/billing");
            } else if (e.ctrlKey && e.key === "p") {
              router.push("/profile");
            } else if (e.ctrlKey && e.key === "s") {
              router.push("/settings");
            }
          }}
          onKeyDown={(e) => {
            // prevent default key action
            e.preventDefault();
          }}
        />
        <CommandList>
          <CommandEmpty className="dark:text-white text-blackmid p-4 flex items-center justify-center">
            No results found.
          </CommandEmpty>
          <CommandGroup
            heading="Suggestions"
            className="dark:text-white/50 text-hovergrey"
          >
            <Link href="/docs">
              <CommandItem>
                <span className="dark:text-white text-blackmid text-base">
                  Docs
                </span>
              </CommandItem>
            </Link>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup
            heading="App"
            className="dark:text-white/50 text-hovergrey"
          >
            <Link href="/profile">
              <CommandItem>
                <span className="dark:text-white text-blackmid text-base">
                  Profile
                </span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
            </Link>
            <Link href="/billing">
              <CommandItem>
                <span className="dark:text-white text-blackmid text-base">
                  Billing
                </span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
            </Link>
            <Link href="/settings">
              <CommandItem>
                <span className="dark:text-white text-blackmid text-base">
                  Settings
                </span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
