import { authenticate } from "./auth";
import {
  gotoFollows,
  loadAllUserList,
  selectAllUsers,
  getUsersInfoFromList,
} from "./utils";

const { chromium } = require("playwright");

export default async function (req, res) {
  const { username, password } = req.body;
  // const username = "simon_blanco_";
  // const password = "";
  const browser = await chromium.launch({ headless: false });
  const { page } = await authenticate(browser, { username, password });

  await gotoFollows(page, username);
  console.time("follows");
  await loadAllUserList(page);
  console.timeEnd("follows");
  const followers = await selectAllUsers(page);
  const followersInfo = await getUsersInfoFromList(followers);

  await browser.close();
  res.send(followersInfo);
}
