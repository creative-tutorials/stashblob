import { useState } from "react";
import axios from "axios";
import { APIURL } from "@/config/apiurl";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { PickSetFolder } from "@/types/appx";

import { FolderPlus, Loader2 } from "lucide-react";

type fProp = string;

export function CreateFolder({ setFolders }: PickSetFolder) {
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();

  const [folderName, setFolderName] = useState<fProp>("");

  const [isSaving, setIsSaving] = useState(false);

  const execCreateFolder = () => {
    setIsSaving(true);
    if (!isSignedIn) {
      return;
    } else {
      const userid = user?.id;
      axios
        .post(
          `${APIURL}/create/folder`,
          {
            foldername: folderName,
          },
          {
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_API_KEY,
              owner: userid,
            },
          }
        )
        .then(async function (response) {
          await getFolders();
          setIsSaving(false);
          toast({
            title: "Success!",
            description: response.data.data,
          });
        })
        .catch(async function (error) {
          console.error(error.response);
          setIsSaving(false);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.response.data.error,
          });
        });
    }
  };

  async function getFolders() {
    if (!isSignedIn) {
      return;
    } else {
      const userID = user?.id;
      axios
        .get(`${APIURL}/all/folder`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
            owner: userID,
          },
        })
        .then(async function (response) {
          setFolders(response.data);
        })
        .catch(async function (error) {
          console.error(error.response);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.response.data.error,
          });
        });
    }
  }

  return (
    <div id="btncreate">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-3 p-3 bg-purupleg2 text-white hover:bg-elemgf">
            <FolderPlus /> Create new folder
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] dark:bg-darkestbg bg-whitebg border dark:border-darkbtn border-hashtext/50">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Carefully input the correct data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                FolderName
              </Label>
              <Input
                id="name"
                className="col-span-3"
                autoComplete="off"
                onChange={(e) => setFolderName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            {isSaving ? (
              <Button
                className="bg-purupleg2 hover:bg-elemgf text-white flex items-center gap-1"
                disabled
              >
                <Loader2 className="animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                className="bg-purupleg2 hover:bg-elemgf text-white flex items-center gap-1"
                onClick={execCreateFolder}
              >
                Submit changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
