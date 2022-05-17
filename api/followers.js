import { IgApiClient } from "instagram-private-api";
import { get_followers } from "./utils/ipa";

export default async function (req, res) {
  console.time("Get Followers");
  const { auth, pk, username } = req.body;

  const ig_client = new IgApiClient();
  ig_client.state.generateDevice(username);
  await ig_client.state.deserialize(auth);
  const followers = await get_followers(ig_client, pk);

  // const arr1 = [];
  // const all = followers.reduce((acc, curr) => {
  //   const exists = acc.find((x) => x.username == curr.username);
  //   if (exists) arr1.push(curr.username);
  //   if (!exists) acc.push(curr);
  //   return acc;
  // }, []);

  // console.log({ arr1: arr1.length, all: all.length });

  console.timeEnd("Get Followers");
  res.status(200).send(followers);
}
