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
  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          className="dark:text-white text-blackmid"
        />
        <CommandList>
          <CommandEmpty className="dark:text-white text-blackmid p-4 flex items-center justify-center">
            No results found.
          </CommandEmpty>
          <CommandGroup heading="Suggestions" className="dark:text-white/50 text-hovergrey">
            <Link href="/settings/2FA">
              <CommandItem>
                <span className="dark:text-white text-blackmid text-base">Enable 2FA</span>
              </CommandItem>
            </Link>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="App" className="dark:text-white/50 text-hovergrey">
            <Link href="/profifle">
              <CommandItem>
                <span className="dark:text-white text-blackmid text-base">Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
            </Link>
            <Link href="/billing">
              <CommandItem>
                <span className="dark:text-white text-blackmid text-base">Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
            </Link>
            <Link href="/settings">
              <CommandItem>
                <span className="dark:text-white text-blackmid text-base">Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
