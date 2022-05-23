const { IgApiClient } = require("instagram-private-api");


module.exports = async function (req, res) {
  const { auth, users } = req.body;

  const ig = new IgApiClient();
  await ig.state.deserialize(auth);

  if (users.length > 1) for (const user of users) {
    const { pk } = user;
    const { outgoing_request } = await ig.friendship.show(pk);
    user.outgoing_request = outgoing_request ? 1 : 0;
  } else {
    const data = await ig.friendship.show(users[0].pk);
    console.log(data)
    const { outgoing_request } = data;
    users[0].outgoing_request = outgoing_request ? 1 : 0;
  }

  res.status(200).send(users);
}
