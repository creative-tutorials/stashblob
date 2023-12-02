import { ReactElement } from "react";
export function SpinLoader<T extends ReactElement>(props: { asChild: T }) {
  return (
    <div
      id="load-wrapper"
      className="flex items-center justify-center text-purplebtn"
    >
      {props.asChild}
    </div>
  );
}
