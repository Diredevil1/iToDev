export const getIdFromUrl = (url: string) => {
  return url.split("/").filter(Boolean).pop();
};
