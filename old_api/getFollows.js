import { getAuthCookie } from "./auth";
import { chromium } from "playwright";
import http from "./http/http.js";
const buildApiUrl = ({ max_id }) =>
  `https://i.instagram.com/api/v1/friendships/2231474509/following/?count=100&max_id=${max_id}&search_surface=follow_list_page`;

//No es necesario crear el browser si el state ya esta guardado.
export default async function (req, res) {
  // const { username, password } = req.body;
  console.time("follows");
  const username = "cucumber.techstore";
  const password = "HOLA1234";
  const browser = await chromium.launch({ headless: false });

  const authCookie = await getAuthCookie({
    username,
    password,
  });
  await browser.close();

  async function getFollowing(max_id = 0, allUsers = []) {
    const apiUrl = buildApiUrl({ max_id });
    const data = await http.get(apiUrl, { headers: { Cookie: authCookie } });
    const { users, next_max_id } = data;
    if (!next_max_id) return allUsers.concat(users);
    return await getFollowing(next_max_id, allUsers.concat(users));
  }

  const following = await getFollowing();

  res.send(following);
}
