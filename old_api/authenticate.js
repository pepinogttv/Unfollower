import { chromium } from "playwright";
import { get_csrftoken } from "./utils";

const { getAuthCookie } = require("./auth");

export default async function (req, res) {
  //   const { username, password } = req.body;
  const username = "cucumber.techstore";
  const password = "HOLA1234";
  const browser = await chromium.launch({ headless: false });
  const authCookie = await getAuthCookie({ username, password });
  const csrftoken = get_csrftoken();
  const user_agent = "Instagram 219.0.0.12.117 Android";
  res.send({ cookie: authCookie, token: csrftoken, user_agent });
}
