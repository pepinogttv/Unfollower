import http from "../http/http";
import { divideArray } from "./utils";
const url = new URL(window.location.href);
const { hostname, protocol } = url;
const port = url.port ? ':3000' : ''

const API_WITH_EXPRESS = port === '8080';
const base_url = `${protocol}//${hostname}${port}/api`
console.log(base_url)
function getFollowers(account) {
  const body = JSON.stringify({
    auth: account.auth,
    pk: account.pk,
    username: account.username,
  });
  return http.post(`${base_url}/followers`, body);
}
function getFollowing(account) {
  const body = JSON.stringify({
    auth: account.auth,
    pk: account.pk,
    username: account.username,
  });
  return http.post(`${base_url}/following`, body);
}
async function getFollowersAndFollowing(account) {
  const [followers, following] = await Promise.all([
    getFollowers(account),
    getFollowing(account),
  ]);
  return { followers, following };
}
async function getAdditionalInfo(auth, users) {
  const url = `${base_url}/users-additional-info`;
  users = divideArray(users, 200);
  let acc = {};
  for (const user_group of users) {
    const body = JSON.stringify({ users: user_group, auth });
    const data = await http.post(url, body);
    acc = { ...acc, ...data };
  }
  return acc;
}

function friendship(auth, action, users) {
  const url = API_WITH_EXPRESS ? `${base_url}/friendship/${action}` : `${base_url}/friendship?action=${action}`;
  const body = JSON.stringify({ users, auth });
  return http.post(url, body);
}
function getUserInfo(auth, pk) {
  const url = `${base_url}/user-info`;
  const body = JSON.stringify({ auth, pk });
  return http.post(url, body);
}
function checkPendingRequests(auth, users) {
  const url = `${base_url}/pending-request`;
  const body = JSON.stringify({ auth, users });
  return http.post(url, body);
}
function downloadProfileImage(downloadUrl) {
  const url = `${base_url}/download-image`;
  const body = JSON.stringify({ url: downloadUrl });
  return http.post(url, body);
}
async function signin(credentials) {
  const url = `${base_url}/ig-auth`;
  const body = JSON.stringify(credentials);
  return http.post(url, body);
}
export default {
  downloadProfileImage,
  getFollowers,
  getFollowing,
  getAdditionalInfo,
  getUserInfo,
  friendship,
  checkPendingRequests,
  getFollowersAndFollowing,
  signin,
};
