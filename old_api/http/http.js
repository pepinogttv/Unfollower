import axios from "axios";

const defaultHeaders = {
  // "Content-Type": "application/json",
  "user-agent": "Instagram 219.0.0.12.117 Android",
};
const x = {
  "x-ig-app-id": "936619743392459",
  "x-ig-www-claim": "hmac.AR354qfjzATyPdGKjoZ4dL6wrCkkdeJ6xT39O8coKgWhrNBk",
  "x-instagram-ajax": "b72e12223c35",
  "x-requested-with": "XMLHttpRequest",
};
const get = async (url, data) => {
  const headers = { ...defaultHeaders, ...data.headers };
  const res = await axios.get(url, { headers });
  return res.data;
};

const post = async (url, data) => {
  console.log(data);
  const headers = { ...defaultHeaders, ...data.headers };
  const res = await axios.post(url, { headers });
  return res;
};

const put = async (url, body) => {};

const _delete = async (url) => {};

export default {
  get,
  post,
  put,
  delete: _delete,
};
