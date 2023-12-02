import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BillingComponent } from "@/types/appx";

export function PlanStats(props: BillingComponent) {
  return (
    <section>
      <div className="w-full border dark:border-borderbtm border-hashtext/50 p-4 rounded flex justify-between md:flex-row lg:flex-row flex-col md:gap-0 lg:gap-0 gap-2" style={{transition: "all 0.2s ease-in-out"}}>
        <div id="textg" className="">
          <hgroup className="flex flex-col gap-2">
            <h2 className="text-2xl font-medium">Current Plan</h2>
            <span>Manage and view your plan</span>
          </hgroup>
        </div>
        <div id="plg" className="">
          {props.hasPaid ? (
            <hgroup>
              <span>This storage is currently on the plan:</span>
              <h3 className="text-2xl dark:text-[#b58dde] text-elemgf">
                Turbo{" "}
                <span className="text-sm font-medium">
                  {props.loading ? "Loading..." : props.totalString}
                </span>
              </h3>
            </hgroup>
          ) : (
            <hgroup>
              <span>This storage is currently on the plan:</span>
              <h3 className="text-2xl dark:text-[#b58dde] text-elemgf">
                FREE{" "}
                <span className="text-sm font-medium">
                  {props.loading ? "Loading..." : props.totalString}
                </span>
              </h3>
            </hgroup>
          )}
        </div>
        <div id="btn-group" className="w-full max-w-md">
          <Link
            href="https://timilab.lemonsqueezy.com/checkout/buy/47120f93-803e-435d-89bd-441482dca0e8"
            target="_blank"
          >
            <Button className="dark:bg-darkbtnhover hover:dark:bg-darkbtn bg-hashtext/50 hover:bg-hashtext/40 w-full">
              Change subscription plan
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
