import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";

export function StorageSense() {
  return (
    <section className="flex md:flex-row lg:flex-row flex-col md:gap-0 lg:gap-0 gap-3 justify-between">
      <hgroup>
        <h2 className="md:text-3xl lg:text-3xl text-2xl font-medium">
          Some Info:
        </h2>
      </hgroup>
      <div
        id="card"
        className="dark:bg-darkmdc bg-darkbtn/10 rounded-md border dark:border-borderbtm border-darkbtn/20 w-full max-w-4xl p-4"
      >
        <div
          className="flex md:flex-row lg:flex-row flex-col gap-4 justify-between"
          id="info"
        >
          <div className="flex gap-2">
            <span>
              <Info className="w-5 h-5 dark:text-hashtext text-borderbtm" />
            </span>
            <hgroup>
              <p>This storage is limited by the included usage</p>
              <span className="text-sm dark:text-hashtext">
                When your storage exceeds the included usage, you will no longer
                be able to upload files. <br /> If you wish to increase your
                storage, you should upgrade to a paid plan.
              </span>
            </hgroup>
          </div>
          <Link
            href="https://timilab.lemonsqueezy.com/checkout/buy/47120f93-803e-435d-89bd-441482dca0e8"
            target="_blank"
          >
            <Button className="x dark:bg-darkbtn bg-borderbtm/20 border border-hashtext dark:border-transparent hover:dark:bg-darkbtnhover hover:bg-borderbtm/25">
              Upgrade Plan
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
