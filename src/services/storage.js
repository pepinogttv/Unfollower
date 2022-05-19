function get(key) {
  let data = window.localStorage.getItem(key);
  try {
    data = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
  return data;
}

function set(key, data) {
  if (typeof data === "object") {
    window.localStorage.setItem(key, JSON.stringify(data));
    return;
  }
  window.localStorage.setItem(key, data);
}

function get_str_date_now() {
  return new Date().toLocaleDateString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function saveLastUpdate(pk) {
  const STORAGE_NAME = "last-updates";
  const user_info = { pk, last_update: get_str_date_now() };
  const last_updates = get(STORAGE_NAME);

  if (!last_updates) return set(STORAGE_NAME, [user_info]);

  const stored = last_updates.find((user) => user.pk === pk);
  if (!stored) return set(STORAGE_NAME, [...last_updates, user_info]);

  stored.last_update = get_str_date_now();

  set(STORAGE_NAME, last_updates);
}

function getLastUpdate(id) {
  const STORAGE_NAME = "last-updates";
  const user_info = getUserInfo(id);
  if (!user_info) return null;
  const { pk } = user_info;
  const last_updates = get(STORAGE_NAME);
  if (!last_updates) return null;
  const stored = last_updates.find((user) => user.pk === pk);
  if (!stored) return null;
  return stored.last_update;
}

function saveUserInfo(user_info) {
  const STORAGE_NAME = "users-info";
  const users_info = get(STORAGE_NAME);
  if (!users_info) return set(STORAGE_NAME, [user_info]);
  const stored_user_info = users_info.find(({ pk }) => pk === user_info.pk);
  if (!stored_user_info) return set(STORAGE_NAME, [...users_info, user_info]);
  const username_change = stored_user_info.username !== user_info.username;
  if (username_change) stored_user_info.username = user_info.username;
  set(STORAGE_NAME, users_info);
}
function updateAccounts(accounts) {
  const STORAGE_NAME = "users-info";
  set(STORAGE_NAME, accounts);
}
function getUserInfo(username) {
  const STORAGE_NAME = "users-info";
  const users_info = get(STORAGE_NAME);
  if (!users_info) return null;
  const stored_user_info = users_info.find(
    (user) => user.username === username
  );
  if (!stored_user_info) return null;
  return stored_user_info;
}

export default {
  saveLastUpdate,
  getLastUpdate,
  saveUserInfo,
  getUserInfo,
  getUsersInfo: () => get("users-info"),
  updateAccounts,
};
