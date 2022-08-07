function shortenURL(url: string) {
  const filterList = ["https://", "http://"];
  filterList.forEach((v) => {
    url = url.replace(v, "");
  });
  return url;
}

export { shortenURL };
