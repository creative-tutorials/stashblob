import { Oval } from "react-loader-spinner";
export function OvalLoader() {
  return (
    <Oval
      height={80}
      width={80}
      color="#7148FC"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#000000"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
}
