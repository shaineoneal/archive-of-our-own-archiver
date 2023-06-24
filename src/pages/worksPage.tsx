import { log } from "../utils/logger";
export function getWorkFromWorksPage() {}

//get work id
export function getWorkId() {
  const url = window.location.href;
  const id = url.split("/")[4];
  log("work id", id);
  return id;
}
