function getAuth() {
  const token = localStorage.getItem('token');
  const url = localStorage.getItem('url');
  if (token != null && url != null) {
    return { token: token, url: url };
  }

  return undefined;
}

export { getAuth };
