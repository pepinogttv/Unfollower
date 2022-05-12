import { authenticate } from "./auth";
import {
  gotoFollowers,
  loadAllUserList,
  selectAllUsers,
  getUsersInfoFromList,
  waitFor,
} from "./utils";

const { chromium } = require("playwright");

export default async function (req, res) {
  const { username, password, unfollow_user } = req.body;
  //   const {
  //     unfollow_user,
  //     username = "cucumber.techstore",
  //     password = " ",
  //   } = req.query;

  const browser = await chromium.launch({ headless: false });
  const { page } = await authenticate(browser, { username, password });

  await page.goto(`https://www.instagram.com/${unfollow_user}/`);

  const unfollowBtn = await page.$("._5f5mN.-fzfL._6VtSN.yZn4P");

  if (!unfollowBtn) {
    await browser.close();
    return res.status(200).send({
      status: "error",
      message: "No sigues a " + unfollow_user,
    });
  }

  await unfollowBtn.click();
  await page.waitForSelector(".piCib");
  const confirmBtn = await page.$(".aOOlW.-Cab_");
  await confirmBtn.click();

  await browser.close();
  return res.status(200).send({
    status: "success",
    message: "Ya no sigues a " + unfollow_user,
  });
}
