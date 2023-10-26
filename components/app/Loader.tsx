
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
        glassColor="#c0efff"
        color="#2559c0"
      />
    </div>
  );
}