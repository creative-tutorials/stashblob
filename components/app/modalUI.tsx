import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { extension } from "@/types/appx";
import { Dispatch, SetStateAction } from "react";
import { useToast } from "@/components/ui/use-toast";

type ModalProp = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  extension: extension;
};

export default function ModalUI({ show, setShow, extension }:ModalProp) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { toast } = useToast();
  const getShareLink = async () => {
    if (!isSignedIn) {
      return;
    } else {
      const id = user.id;
      const filename = extension.filename;
      const uploadID = extension.uploadID;
      toast({
        description: "Please wait...",
      });
      axios
        .get(`http://localhost:8080/share/${filename}/${uploadID}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        .then(async function (response) {
          // console.log(response.data);
          const url: string = response.data.message;
          await copyTextToClipboard(url)
            .then(async function (data) {
              console.log(data);
              toast({
                title: "Success",
                description: data,
              });
            })
            .catch(async function (error) {
              console.error(error);
              toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
              });
            });
        })
        .catch(async function (error) {
          console.error(error.response);
        });
    }
  };

  async function copyTextToClipboard(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setShow(false);
      return "Copied share link";
    } catch (error) {
      console.error(error);
      setShow(false);
      throw new Error("failed to copy");
    }
  }

  return (
    <div
      className={
        show
          ? "fixed w-full h-full bg-darkmxbtn/50 backdrop-blur-md top-0 right-0 flex items-center justify-center min-h-screen transition-all opacity-1 pointer-events-auto"
          : "fixed w-full h-full bg-darkmxbtn/50 backdrop-blur-md top-0 right-0 flex items-center justify-center min-h-screen transition-all opacity-0 pointer-events-none"
      }
    >
      <div
        className={
          show
            ? "w-full max-w-md rounded-lg p-4 bg-[#101013] flex flex-col gap-5 transition-all scale-1 shadow-xl"
            : "w-full max-w-md rounded-lg p-4 bg-[#101013] flex flex-col gap-5 transition-all scale-0"
        }
      >
        <header className="flex items-center justify-between">
          <h4 className="text-white text-2xl">Share</h4>
          <X
            className="text-midwhite2 cursor-pointer"
            onClick={() => setShow(false)}
          />
        </header>
        <section className="flex flex-col gap-2">
          <span className="text-hashtext">Invite</span>
          <div className="flex items-center gap-3">
            <Input
              type="email"
              placeholder="Type emails here..."
              className="border border-darkbtn/30 bg-thirdprop focus:bg-darkmxbtn text-hashtext"
              disabled
            />
            <Button
              className="bg-royalblue hover:bg-royalglue px-7 text-white"
              disabled
            >
              Share
            </Button>
          </div>
        </section>
        <section className="mt-8 flex flex-col gap-2">
          <span className="text-hashtext">Get Link</span>
          <div className="">
            <Button
              variant="link"
              className="flex items-center gap-2 text-fileicon"
              onClick={getShareLink}
            >
              <Copy className="w-6 h-6" /> Copy link
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
