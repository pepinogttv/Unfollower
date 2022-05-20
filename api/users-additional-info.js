const { IgApiClient } = require("instagram-private-api");


module.exports = async function (req, res) {
  console.log("GET ADDITIONAL INFO");
  console.time("Aditional Info");
  const { auth, users } = req.body;

  const ig_client = new IgApiClient();
  await ig_client.state.deserialize(auth);

  const promises = users.map(({ pk }) => ig_client.user.info(pk));

  const additional_info = await Promise.allSettled(promises);

  const indexed_addt_info = additional_info.reduce(
    (acc, { status, value, reason }) => {
      // if (status === "rejected") console.log(reason);
      if (status === "rejected") return acc;
      acc[value.pk] = {
        following_count: value.following_count,
        follower_count: value.follower_count,
        hd_profile_pic_url_info: value.hd_profile_pic_url_info,
        pending_request: 0,
      };
      return acc;
    },
    {}
  );

  console.timeEnd("Aditional Info");
  res.send(indexed_addt_info);
}
