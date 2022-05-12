import { IgApiClient } from "instagram-private-api";
import { authenticate } from "./utils/ipa";

export default async function (req, res) {
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
  // res.send([]);
}

// const rejecteds = additional_info.filter(({ status }) => status === "rejected");

// const rejecteds = additional_info
//   .map((res, i) => {
//     res.index = i;
//     return res;
//   })
//   .filter(({ status }) => status === "rejected");
// rejecteds.forEach(({ index }) => console.log(users[index].username));
// const news = Promise.all(rejecteds.map(({ index }) => ig_client.user.info(users[index].pk)));

// additional_info.map((res, index) => {
//   if(res.status === 'rejected'){
//     let neww;
//     rejecteds.forEach((rejected, i) => {
//       if(rejected.index === index) neww = news[i]
//     })
//   }
// })
