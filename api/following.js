const { IgApiClient } = require("instagram-private-api");
const { get_following } = require("./utils/ipa.js");

module.exports = async function (req, res) {
  console.time("Get Following");
  const { auth, pk, username } = req.body;

  const ig_client = new IgApiClient();
  await ig_client.state.deserialize(auth);

  const following = await get_following(ig_client, pk);

  console.timeEnd("Get Following");
  res.send(following);
}
