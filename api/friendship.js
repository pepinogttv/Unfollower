import { IgApiClient } from "instagram-private-api";
import { authenticate } from "./utils/ipa";
const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function (req, res) {
  console.time("Unfollow");
  const { auth, users } = req.body;
  const { action } = req.query;

  const ig_client = new IgApiClient();
  await ig_client.state.deserialize(auth);

  if (users.length > 1) {
    for (const user of users) {
      await ig_client.friendship[action](user.pk);
      await waitFor(Math.random() * 6000 + 1000);
    }
  } else {
    try {
      console.log({ action });
      const x = await ig_client.friendship[action](users[0].pk);
      console.log(x);
    } catch (err) {
      console.log(err);
    }
  }

  console.timeEnd("Unfollow");
  res.status(200).send({ status: "success", users });
}
