import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";

export type TypeExtension = {
  filename: string;
  uploadID: string;
};
export type typeUpldState = {
  isUploading: boolean;
  props: {
    uploading: string;
    upload: string;
  };
};
export type typeCounter = number;

export type booleanType = boolean;

export type supaType = {
  projectURL: string;
  public_anon_key: string;
  bucket: string;
  folder: string;
};

export type searchQuery = string;

export type PropFolders = {
  folders: never[];
  setFolders: Dispatch<SetStateAction<never[]>>;
  setIsFolded: Dispatch<SetStateAction<boolean>>;
};

export type PickSetFolder = Pick<PropFolders, "setFolders">;

export type typeFolder = {
  folderID: string;
  folderName: string;
  owner: string;
};
export type typeFile = {
  date: string;
  filename: string;
  filesize: string;
  filetype: string;
  uploadID: string;
  username: string;
};

export type PickFileKV = Omit<typeFile, "username">;

export type PickerProp = {
  states: {
    setIsShown: Dispatch<SetStateAction<boolean>>;
    isShown: boolean;
    setFolders: Dispatch<SetStateAction<never[]>>;
    folders: never[];
  };
};
export type TypeErrProp = {
  isErr: boolean;
  err: string;
};
export type typeObjBolean = {
  queue1: boolean;
  queue2: boolean;
};
export type Comments = {
  commentID: string;
  comment: string;
  fullName: string;
  userid: string;
  pulseColor: string;
  imageURL: string;
};
export type BillingComponent = {
  hasPaid: boolean;
  loading: boolean;
  totalString: string;
};
export type BillBreak = Pick<BillingComponent, "totalString" | "loading"> & {
  router: NextRouter;
  used: number;
};
export type PaginationProps = {
  length: { currentPage: number; GetLength: () => number; pageSize: number };
  handlePageChange: (nextPage: number) => void;
};
