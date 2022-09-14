import Api from "./Api.js";
import { indexArray, filterRepeated } from "./utils.js";
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

function compareRelatedUsers(oldUsers, newUsers) {
  console.log(oldUsers);
  const oldFollowers = oldUsers.followers;
  const newFollowers = newUsers.followers;
  const oldGainedFollowers = oldUsers.gainedFollowers;
  const oldLostFollower = oldUsers.lostFollowers;

  const indexedOldFollowers = indexArray(oldFollowers, "pk");
  const indexedNewFollowers = indexArray(newFollowers, "pk");

  const oldLostFollowersToHold = oldLostFollower.filter(
    (follower) => !indexedNewFollowers[follower.pk]
  );
  const oldGainedFollowersToHold = oldGainedFollowers.filter(
    (follower) => indexedNewFollowers[follower.pk]
  );

  const gainedFollowers = newFollowers
    .filter((follower) => !indexedOldFollowers[follower.pk])
    .concat(oldGainedFollowersToHold);
  const lostFollowers = oldFollowers
    .filter((follower) => !indexedNewFollowers[follower.pk])
    .concat(oldLostFollowersToHold);

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

function filterRepeatedUsers(users) {
  const withoutRepeateds = {};

  Object.entries(users).forEach(([key, value]) => {
    withoutRepeateds[key] = filterRepeated(value, "pk");
  });

  return withoutRepeateds;
}

async function updateRelatedUsers(account) {
  const { pk } = account;
  const DB = await UsersDB(pk);

  const [dataBaseUsers, updatedUsers] = await Promise.all([
    DB.getUsers(),
    Api.getFollowersAndFollowing(account),
  ]);

  const isFirstDB = !Object.values(dataBaseUsers).find((v) => v.length);

  if (isFirstDB) {
    const updatedUsers = await Api.getFollowersAndFollowing(account);
    const allUsers = {
      ...updatedUsers,
      ...getComputedUsers(updatedUsers),
    };

    const filteredUsers = filterRepeatedUsers(allUsers);
    const users = DB.setUsers(filteredUsers);
    DB.close();
    return users;
  }

  DB.close();
  await DB.delete();

  let relatedUsers = compareRelatedUsers(dataBaseUsers, updatedUsers);
  relatedUsers = filterRepeatedUsers({
    ...relatedUsers,
    ...getComputedUsers(relatedUsers),
  });

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
