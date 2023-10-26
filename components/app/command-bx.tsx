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
          className="text-white"
        />
        <CommandList>
          <CommandEmpty className="text-white p-4 flex items-center justify-center">
            No results found.
          </CommandEmpty>
          <CommandGroup heading="Suggestions" className="text-white/50">
            <Link href="/settings/2FA">
              <CommandItem>
                <span className="text-white text-base">Enable 2FA</span>
              </CommandItem>
            </Link>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="App" className="text-white/50">
            <Link href="/profifle">
              <CommandItem>
                <span className="text-white text-base">Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
            </Link>
            <Link href="/billing">
              <CommandItem>
                <span className="text-white text-base">Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
            </Link>
            <Link href="/settings">
              <CommandItem>
                <span className="text-white text-base">Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </Link>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
