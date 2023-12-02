import { TailSpin } from "react-loader-spinner";

export function TailSpinner() {
  return (
    <div className="flex items-center justify-center">
      <TailSpin
        height="80"
        width="80"
        color="#6f2dbd"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}
