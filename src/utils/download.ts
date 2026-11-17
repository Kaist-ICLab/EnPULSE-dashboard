/** Save a blob through the browser's download prompt. */
export function triggerFileDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Some browsers need the blob URL to remain valid briefly.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
