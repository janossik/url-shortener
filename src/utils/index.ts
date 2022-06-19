export const checkUrl = async (url: string) => {
  const response = await fetch(url);
  return response.status !== 200;
};
