import { chromium } from "playwright";
import { authenticate, getAuthCookie } from "./auth";
import { get_csrftoken, waitFor } from "./utils";

const buildApiUrl = ({ follower_id }) =>
  `https://www.instagram.com/web/friendships/${follower_id}/remove_follower/`;

export default async function (req, res) {
  const { follower_id } = req.query;
  const username = "cucumber.techstore";
  const password = " ";

  const browser = await chromium.launch({ headless: false });
  const { page } = await authenticate(browser, { username, password });
  const Cookie = await getAuthCookie({ username, password });

  const apiUrl = buildApiUrl({ follower_id });
  const csrftoken = get_csrftoken();
  const promise = await page.evaluate(
    ({ apiUrl, Cookie, csrftoken }) => {
      fetch(apiUrl, {
        method: "POST",
        headers: {
          Cookie: Cookie,
          "user-agent": "Instagram 219.0.0.12.117 Android",
          "x-csrftoken": csrftoken,
        },
      });
    },
    { apiUrl, Cookie, csrftoken }
  );
  console.log(promise);
  // await waitFor(1000000);
  await browser.close();
  res.send("putop");
}

// "sec-ch-ua-mobile": "?0",
// "sec-ch-ua-platform": '"Windows"',
// "sec-fetch-dest": "empty",
// "sec-fetch-mode": "cors",
// "sec-fetch-site": "same-origin",
// "user-agent": "Instagram 219.0.0.12.117 Android",
// "x-asbd-id": "198387",
// "x-csrftoken": csrftoken,
// "Content-Type": "application/x-www-form-urlencoded",
// "x-ig-app-id": "936619743392459",
// "x-ig-www-claim":
//   "hmac.AR354qfjzATyPdGKjoZ4dL6wrCkkdeJ6xT39O8coKgWhrNBk",
// "x-instagram-ajax": "b72e12223c35",
// "x-requested-with": "XMLHttpRequest",
