const { IgApiClient } = require("instagram-private-api")
const { get_followers } = require("./utils/ipa.js");

module.exports = async function (req, res) {
  console.time("Get Followers");
  const { auth, pk, username } = req.body;

  const ig_client = new IgApiClient();

  ig_client.state.generateDevice(username);
  await ig_client.state.deserialize(auth);
  const followers = await get_followers(ig_client, pk);

  console.timeEnd("Get Followers");
  res.status(200).send(followers);
}
