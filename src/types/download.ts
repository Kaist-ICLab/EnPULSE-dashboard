import { ResponseStatus } from "./response";

export type DownloadFileRow = {
  isChecked: boolean;
  table: string;
  uuid: string;
  pid: number;
  date: Date;
  count: number;
  downloadStatus: ResponseStatus;
};
