import { Button } from "@/components/ui/button";
import { PaginationProps } from "@/types/appx";

export function FilesPagination(props: PaginationProps) {
  return (
    <div className="flex items-end justify-end gap-2">
      {props.length.currentPage !== 1 && (
        <Button
          className="border dark:border-darkbtn border-borderbtm/50 hover:dark:bg-darkbtn hover:bg-hashtext/30"
          onClick={() => props.handlePageChange(props.length.currentPage - 1)}
        >
          Prev
        </Button>
      )}
      {props.length.currentPage <=
        props.length.GetLength() / props.length.pageSize && (
        <Button
          className="border dark:border-darkbtn border-borderbtm/50 hover:dark:bg-darkbtn hover:bg-hashtext/30"
          onClick={() => props.handlePageChange(props.length.currentPage + 1)}
        >
          Next
        </Button>
      )}
    </div>
  );
}
