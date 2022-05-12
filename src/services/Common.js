import Api from "./Api.js";
import { filterRepeated, indexArray } from "./utils.js";
import storage from "./storage";
import UsersDB from "./RelatedUsersDB";

async function updatePendingRequests({ auth, pk }) {
  const LocalDB = {};
  const localDB = LocalDB(pk);
  const users = await localDB.get_pending_requests();
  const no_repeated_users = filterRepeated(users, "pk");
  const updated_users = await Api.checkPendingRequests(auth, no_repeated_users);
  console.log(updated_users);
  for (const user of updated_users) {
    if (user.pending_request) continue;
    const stores = await localDB.stores_of_user(user);
    console.log(stores);
    await localDB.put_user(user, stores);
    const isFollower = await localDB.get_user(user.pk, "followers");
    if (isFollower) {
      await localDB.add_user(user, ["following", "friends"]);
    } else {
      await localDB.add_user(user, ["following", "idols"]);
    }
  }
}
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
  const relatedUsers = await Api.getFollowersAndFollowing(account);
  // const allUsers = filterRepeated(followers.concat(following), "pk");
  // const addtInfo = await Api.getAdditionalInfo(account, allUsers);
  // let relatedUsers = addAdditionalInfo({ following, followers }, addtInfo);
  return relatedUsers;
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

  if (DB.isFirstDB()) {
    console.log("IS FIRST DB");
    const updatedUsers = await getUpdatedUsers(account);
    return DB.setUsers({
      ...updatedUsers,
      ...getComputedUsers(updatedUsers),
    });
  }

  const [dataBaseUsers, updatedUsers] = await Promise.all([
    DB.getUsers(),
    getUpdatedUsers(account),
  ]);

  DB.close();
  await DB.delete();

  let relatedUsers = compareRelatedUsers(dataBaseUsers, updatedUsers);
  relatedUsers = {
    ...relatedUsers,
    ...getComputedUsers(relatedUsers),
  };

  const storeNames = Object.keys(relatedUsers);
  const newDB = await UsersDB(pk, storeNames);

  storage.saveLastUpdate(pk);
  return newDB.setUsers(relatedUsers);
}

async function getRelatedUsers(pk) {
  const DB = await UsersDB(pk);
  if (DB.isFirstDB()) return {};
  const users = await DB.getUsers();
  DB.close();
  return users;
}

async function isFirstDB(pk) {
  const DB = await UsersDB(pk);
  const isFirstDB = DB.isFirstDB();
  DB.close();
  return isFirstDB;
}

export {
  updateRelatedUsers,
  updatePendingRequests,
  getRelatedUsers,
  isFirstDB,
  signin,
};
