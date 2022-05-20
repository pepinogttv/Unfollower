const { IgApiClient } = require("instagram-private-api");
const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = async function (req, res) {
  console.time("Unfollow");
  const { auth, users } = req.body;
  const action = req.query.action ?? req.params.action;
  if (!action) return
  const ig_client = new IgApiClient();
  await ig_client.state.deserialize(auth);

  if (users.length > 1) {
    for (const user of users) {
      await ig_client.friendship[action](user.pk);
      await waitFor(Math.random() * 6000 + 1000);
    }
  } else {
    try {
      const { pk } = users[0];
      await ig_client.friendship[action](pk);
      console.log(await ig_client.friendship.show(pk))
    } catch (err) {
      console.log(err);
    }
  }

  console.timeEnd("Unfollow");
  res.status(200).send({ status: "success", users });
}
