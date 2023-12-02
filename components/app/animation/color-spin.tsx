import { ReactElement } from "react";
export function ColorSpin<T extends ReactElement>(props: { asChild: T }) {
  return (
    <div className="flex mt-8 w-full items-center justify-center">
      {props.asChild}
    </div>
  );
}
