const headers = {
  "Content-Type": "application/json",
};

const get = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers,
  });
  try {
    return await response.json();
  } catch (error) {
    return {
      error,
      url,
    };
  }
};

const post = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });
  return response.json();
};

const put = async (url, body) => {
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body,
  });
  return await response.json();
};

const _delete = async (url) => {
  const response = await fetch(url, {
    method: "DELETE",
    headers,
  });
  return await response.json();
};

export default {
  get,
  post,
  put,
  delete: _delete,
};
