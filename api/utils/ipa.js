import fs from "fs";

function auth_exists() {
  return fs.existsSync("auth.json");
}

function save_auth(auth) {
  fs.writeFileSync("auth.json", JSON.stringify(auth));
}

function get_auth() {
  return JSON.parse(fs.readFileSync("auth.json"));
}

async function authenticate(username, password, ig_client) {
  ig_client.state.generateDevice(username);
  ig_client.request.end$.subscribe(async () => {
    const serialized = await ig_client.state.serialize();
    delete serialized.constants;
    save_auth(serialized);
  });

  if (auth_exists()) {
    console.log("auth exist");
    await ig_client.state.deserialize(get_auth());
    const pk = await ig_client.user.getIdByUsername(username);
    return { pk };
  } else {
    return await ig_client.account.login(username, password);
  }
}

async function get_followers(ig_client, pk) {
  const followers_feed = ig_client.feed.accountFollowers(pk);
  const alls = [];

  return new Promise((resolve, reject) => {
    followers_feed.items$.subscribe(
      (followers) => {
        alls.push(followers);
      },
      (error) => reject(error),
      () => resolve(alls.flat())
    );
  });
}

async function get_following(ig_client, pk) {
  const followers_feed = ig_client.feed.accountFollowing(pk);
  const alls = [];

  return new Promise((resolve, reject) => {
    followers_feed.items$.subscribe(
      (followers) => {
        alls.push(followers);
      },
      (error) => reject(error),
      () => resolve(alls.flat())
    );
  });
}

export { get_following, get_followers, authenticate };
