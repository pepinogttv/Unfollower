import { authenticate } from "../auth";
import {
  gotoFollowers,
  loadAllUserList,
  selectAllUsers,
  getUsersInfoFromList,
} from "../utils";

const { chromium } = require("playwright");

export default async function (req, res) {
  const { username, password } = req.body || {
    username: "cucumber.techstore",
    password: "HOLA1234",
  };

  const browser = await chromium.launch({ headless: false });
  const { page } = await authenticate(browser, { username, password });

  await gotoFollowers(page, username);
  console.time("followers");
  await loadAllUserList(page);
  console.timeEnd("followers");
  const followers = await selectAllUsers(page);
  const followersInfo = await getUsersInfoFromList(followers);

  await browser.close();
  res.send(followersInfo);
}
