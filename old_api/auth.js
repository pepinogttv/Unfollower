import { checkStorageExists, signin, getCookieHeader, getState } from "./utils";
import { chromium } from "playwright";

async function getAuthCookie({ username, password }) {
  const exitsStorage = checkStorageExists();
  if (!exitsStorage) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await signin(page, username, password);
    await page.waitForSelector(".coreSpriteKeyhole");
    await context.storageState({ path: "state.json" });
  }
  return getCookieHeader(getState().cookies);
}

async function authenticate(browser, { username, password }) {
  const exitsStorage = checkStorageExists();
  let context, page, authCookie;

  if (exitsStorage) {
    context = await browser.newContext({ storageState: "state.json" });
    page = await context.newPage();
    await page.goto("https://www.instagram.com/");
  } else {
    context = await browser.newContext();
    page = await context.newPage();
    await signin(page, username, password);
    await page.waitForSelector(".coreSpriteKeyhole");
    await context.storageState({ path: "state.json" });
  }

  return { context, page };
}

export { getAuthCookie, authenticate };
