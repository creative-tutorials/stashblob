import { MagnifyingGlass } from "react-loader-spinner";
export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <MagnifyingGlass
        visible={true}
        height="80"
        width="80"
        ariaLabel="MagnifyingGlass-loading"
        wrapperStyle={{}}
        wrapperClass="MagnifyingGlass-wrapper"
        glassColor="#c9a6ff"
        color="#6f2dbd"
      />
    </div>
  );
}
