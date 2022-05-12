const fs = require("fs");

function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function checkStorageExists() {
  return fs.existsSync("state.json");
}

async function signin(page, USER, PASSWORD) {
  await page.goto("https://www.instagram.com/");

  await page.fill('[name="username"]', USER);
  await page.fill('[name="password"]', PASSWORD);
  await page.click("text=Log In");
}

// async function loadAllUserList(page) {
//   async function scrollToSpin() {
//     const spin = await page.$(".oMwYe");
//     if (!spin) return;

//     await spin.scrollIntoViewIfNeeded();
//     await waitFor(2000);
//     return scrollToSpin();
//   }

//   try {
//     await page.waitForSelector(".oMwYe", { timeout: 3000 });
//     await scrollToSpin();
//   } catch (err) {
//     return;
//   }
// }

async function loadAllUserList(page) {
  await waitFor(100000);
}

function getCookieHeader(cookies) {
  return cookies.reduce((acc, { name, value }, i) => {
    const separator = i === cookies.length - 1 ? "" : "; ";
    acc += `${name}=${value}${separator}`;
    return acc;
  }, "");
}

function getState() {
  return JSON.parse(fs.readFileSync("state.json"));
}

async function selectAllUsers(page) {
  await page.waitForSelector("._6xe7A");
  const list = await page.$("._6xe7A");
  const items = await list.$$("li");
  return items;
}

async function gotoProfile(page, USER) {
  await page.goto(`https://www.instagram.com/${USER}/followers/`);
}

async function gotoFollowers(page, USER) {
  await gotoProfile(page, USER);
  await page.click("text=Followers");
}

async function gotoFollows(page, USER) {
  await gotoProfile(page, USER);
  await page.click("text=Following");
}

async function getUserInfoFromListItem(follower) {
  const getName = async () => {
    let nameEl = await follower.$("._7UhW9.xLCgt.MMzan._0PwGv.fDxYl");
    if (!nameEl) nameEl = await follower.$(".wFPL8");
    const name = nameEl ? await nameEl.innerText() : "";
    return { name };
  };
  const getUsername = async () => {
    const usernameEl = await follower.$(
      "._7UhW9.xLCgt.qyrsm.KV-D4.se6yk.T0kll"
    );
    const username = usernameEl ? await usernameEl.innerText() : "";
    return { username };
  };
  const getImgUrl = async () => {
    const imgEl = await follower.$("img");
    if (!imgEl) return { imgUrl: "" };
    const imgUrl = await follower.$eval("img", ({ src }) => src);
    return { imgUrl };
  };
  const getIFollowIt = async () => {
    const iFollowIt = !(await follower.$("._7UhW9.PIoXz.qyrsm.uL8Hv"));
    return { iFollowIt };
  };
  const getIsOfficialAccount = async () => {
    const isOfficialAccount = !!(await follower.$('[title="Verified"]'));
    return { isOfficialAccount };
  };

  const promises = [
    getName,
    getUsername,
    getImgUrl,
    getIFollowIt,
    getIsOfficialAccount,
  ].map((fn) => fn());

  const responses = await Promise.all(promises);
  return responses.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

async function getUsersInfoFromList(followers) {
  let usersInfo = [];
  for (const follower of followers) {
    const userInfo = await getUserInfoFromListItem(follower);
    usersInfo.push(userInfo);
  }
  return usersInfo;
}

function get_csrftoken() {
  return getState().cookies.find(({ name }) => name === "csrftoken").value;
}

module.exports = {
  signin,
  gotoFollowers,
  checkStorageExists,
  loadAllUserList,
  gotoProfile,
  waitFor,
  selectAllUsers,
  getUsersInfoFromList,
  gotoFollows,
  getCookieHeader,
  getState,
  get_csrftoken,
};
