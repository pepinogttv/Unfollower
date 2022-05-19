import Api from "./Api.js";
import { indexArray } from "./utils.js";
import storage from "./storage";
import UsersDB from "./RelatedUsersDB";

async function signin(credentials) {
  const res = await Api.signin(credentials);
  if (res.status === "success") {
    return {
      data: res.data,
    };
  } else {
    return {
      error: res.data,
    };
  }
}
function getComputedUsers({ followers, following }) {
  const indexedFollowers = indexArray(followers, "pk");
  const indexedFollowing = indexArray(following, "pk");
  const fans = followers.filter(({ pk }) => !indexedFollowing[pk]);
  const idols = following.filter(({ pk }) => !indexedFollowers[pk]);
  const friends = followers.filter(({ pk }) => indexedFollowing[pk]);
  return { fans, idols, friends };
}

async function getUpdatedUsers(account) {
  return await Api.getFollowersAndFollowing(account);
}

function compareRelatedUsers(oldUsers, newUsers) {
  const oldFollowers = oldUsers.followers;
  const newFollowers = newUsers.followers;
  console.log({ oldFollowers, newFollowers });
  const indexedOldFollowers = indexArray(oldFollowers, "pk");
  const indexedNewFollowers = indexArray(newFollowers, "pk");

  const gainedFollowers = newFollowers.filter(
    (follower) => !indexedOldFollowers[follower.pk]
  );
  const lostFollowers = oldFollowers.filter(
    (follower) => !indexedNewFollowers[follower.pk]
  );

  if (gainedFollowers.length && lostFollowers.length) {
    return {
      ...newUsers,
      gainedFollowers,
      lostFollowers,
    };
  } else if (gainedFollowers.length && !lostFollowers.length) {
    return {
      ...newUsers,
      gainedFollowers,
    };
  } else if (!gainedFollowers.length && lostFollowers.length) {
    return {
      ...newUsers,
      lostFollowers,
    };
  } else {
    return newUsers;
  }
}

async function updateRelatedUsers(account) {
  const { pk } = account;
  const DB = await UsersDB(pk);

  const [dataBaseUsers, updatedUsers] = await Promise.all([
    DB.getUsers(),
    getUpdatedUsers(account),
  ]);

  const isFirstDB = !Object.values(dataBaseUsers).find(v => v.length)

  if (isFirstDB) {
    const updatedUsers = await getUpdatedUsers(account);
    const users = DB.setUsers({
      ...updatedUsers,
      ...getComputedUsers(updatedUsers),
    });
    DB.close();
    return users
  }

  DB.close();
  await DB.delete();

  let relatedUsers = compareRelatedUsers(dataBaseUsers, updatedUsers);
  relatedUsers = {
    ...relatedUsers,
    ...getComputedUsers(relatedUsers),
  };

  // const storeNames = Object.keys(relatedUsers);
  const newDB = await UsersDB(pk);

  storage.saveLastUpdate(pk);
  return newDB.setUsers(relatedUsers);
}

async function getRelatedUsers(pk) {
  const DB = await UsersDB(pk);
  const users = await DB.getUsers();
  DB.close();
  return users;
}

export { updateRelatedUsers, getRelatedUsers, signin };
