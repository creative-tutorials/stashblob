import axios from "axios";
import { APIURL } from "@/config/apiurl";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, X, Loader2 } from "lucide-react";
import { extension } from "@/class/extension";
import { Dispatch, SetStateAction, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

type ModalProp = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
};

export function ModalUI({ show, setShow }: ModalProp) {
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const getShareLink = async () => {
    if (!isSignedIn) {
      return;
    } else {
      setIsLoading(true);
      const id = user.id;
      const filename = extension.filename;
      const uploadID = extension.uploadID;
      toast({
        description: "Please wait...",
      });
      axios
        .get(`${APIURL}/share/${filename}/${uploadID}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        .then(async function (response) {
          const url: string = response.data.message;
          await copyTextToClipboard(url)
            .then(async function (data) {
              console.log(data);
              toast({
                title: "Success",
                description: data,
              });
              setIsLoading(false);
            })
            .catch(async function (error) {
              console.error(error);
              toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
              });
              setIsLoading(false);
            });
        })
        .catch(async function (error) {
          console.error(error.response);
          setIsLoading(false);
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
            ? "w-full max-w-md rounded-lg p-4 dark:bg-darkestbg bg-whitebg dark:border-none border border-borderbtm/20 flex flex-col gap-5 transition-all scale-1 shadow-xl"
            : "w-full max-w-md rounded-lg p-4 dark:bg-darkestbg bg-whitebg dark:border-none border border-borderbtm/20 flex flex-col gap-5 transition-all scale-0"
        }
      >
        <header className="flex items-center justify-between">
          <h4 className="dark:text-whit font-medium text-2xl">Share</h4>
          <X
            className="dark:text-midwhite2 text-secondpro cursor-pointer"
            onClick={() => setShow(false)}
          />
        </header>
        <section className="flex flex-col gap-2">
          <span className="dark:text-hashtext">Invite</span>
          <div className="flex items-center gap-3">
            <Input
              type="email"
              placeholder="Type emails here..."
              className="border dark:border-darkbtn/30 dark:bg-thirdprop focus:dark:bg-darkmxbtn bg-darkestbg text-hashtext"
              disabled
            />
            <Button
              className="bg-purupleg2 hover:bg-elemgf px-7 text-white"
              disabled
            >
              Share
            </Button>
          </div>
        </section>
        <section className="mt-8 flex flex-col gap-2">
          <span className="dark:text-hashtext text-darkbtn font-medium">
            Get Link
          </span>
          <div className="">
            <Button
              variant="link"
              className={`flex items-center gap-2 text-white hover:bg-elemgf ${
                isLoading
                  ? "pointer-events-none bg-purupleg2/50"
                  : "pointer-events-auto bg-purupleg2"
              }`}
              onClick={getShareLink}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />{" "}
                  <Copy className="w-6 h-6" /> Copy link
                </>
              ) : (
                <>
                  <Copy className="w-6 h-6" /> Copy link
                </>
              )}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
