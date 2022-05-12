import { getAuthCookie } from "./auth";
import { chromium } from "playwright";
import http from "./http/http.js";
const buildApiUrl = ({ max_id }) =>
  `https://i.instagram.com/api/v1/friendships/2231474509/followers/?count=50&max_id=${max_id}&search_surface=follow_list_page`;
("https://i.instagram.com/api/v1/friendships/show_many/");

export default async function (req, res) {
  // const { username, password } = req.body;
  console.log("get followers");
  console.time("followers");
  const username = "cucumber.techstore";
  const password = " ";

  const browser = await chromium.launch({ headless: false });

  const authCookie = await getAuthCookie({
    username,
    password,
  });
  await browser.close();

  async function getAllFollowers(max_id = 0, allUsers = []) {
    const apiUrl = buildApiUrl({ max_id });
    const data = await http.get(apiUrl, { headers: { Cookie: authCookie } });
    const { users, next_max_id } = data;
    if (!next_max_id) return allUsers.concat(users);
    return await getAllFollowers(next_max_id, allUsers.concat(users));
  }

  const followers = await getAllFollowers();
  console.log(followers.length);

  const repeated = [];
  followers.reduce((acc, curr) => {
    const exist = acc.find((x) => x.username === curr.username);
    if (exist) {
      repeated.push({ username: curr.username, pk: curr.pk });
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);
  console.log(repeated);
  res.send(followers);
}
