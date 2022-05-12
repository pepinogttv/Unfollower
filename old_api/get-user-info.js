import { getAuthCookie } from "./auth";
import http from "./http/http";
const buildApiUrl = (pk) => `https://i.instagram.com/api/v1/users/${pk}/info/`;

function getUserInfo(pk, headers) {
  const apiUrl = buildApiUrl(pk);
  return http.get(apiUrl, { headers });
}

export default async function (req, res) {
  console.log("executed");
  res.setTimeout(0);
  const { credentials, users } = req.body;
  const Cookie = await getAuthCookie(credentials);
  const headers = { Cookie };
  const promises = users.map(({ pk }) => getUserInfo(pk, headers));
  const data = await Promise.all(promises);
  const necesary = data.reduce((acc, { user }) => {
    const { follower_count, following_count, hd_profile_pic_url_info, pk } =
      user;
    acc[pk] = {
      follower_count,
      following_count,
      hd_profile_pic_url_info,
    };
    return acc;
  }, {});
  console.log(necesary);
  res.send(necesary);
}

// export default async function (req, res) {
//   const { username } = req.query;
//   const { credentials } = req.body || {
//     credentials: { username: "cucumber.techstore", password: " " },
//   };
//   const Cookie = await getAuthCookie(credentials);
//   const apiUrl = buildApiUrl({ username });
//   const headers = { Cookie };
//   const data = await http.get(apiUrl, { headers });

//   const {
//     user: { follower_count, following_count, hd_profile_pic_url_info },
//   } = data;

//   console.log(username);
//   const x = {
//     follower_count,
//     following_count,
//     hd_profile_pic_url_info,
//     pk: username,
//   };
//   res.status(200).send(x);
// }

// ######## WITH __a=1 api
//   `https://www.instagram.com/${username}/?__a=1`;
//   const {
//     graphql: {
//       user: { edge_follow, edge_followed_by },
//     },
//   } = data;
//   const x = { following: edge_follow.count, followers: edge_followed_by.count };
