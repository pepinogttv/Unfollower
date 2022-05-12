import { IgApiClient } from "instagram-private-api";
import { get_following, authenticate } from "./utils/ipa";

export default async function (req, res) {
  console.time("Get Following");
  const { auth, pk, username } = req.body;

  const ig_client = new IgApiClient();
  await ig_client.state.deserialize(auth);

  const following = await get_following(ig_client, pk);

  console.timeEnd("Get Following");
  res.send(following);
}
