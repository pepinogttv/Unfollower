import Api from "../services/Api";
const LocalDB = {};
const storage = {};
async function unfollow({ user, credentials, from, error, success }) {
  const { status } = await Api.friendship(credentials, "destroy", [user]);
  if (status === "success") {
    const { pk } = storage.getUserInfo(credentials.username);
    const localDB = LocalDB(pk);
    if (from === "following") {
      if (await localDB.get_user(user.pk, "idols")) {
        await localDB.delete_user(user.pk, ["following", "idols"]);
      } else {
        await localDB.delete_user(user.pk, ["following", "friends"]);
      }
    } else if (from === "idols") {
      await localDB.delete_user(user.pk, ["following", "idols"]);
    } else if (from === "friends" || from === "followers") {
      await localDB.delete_user(user.pk, ["following", "friends"]);
    } else {
      console.error("Los fans no te siguen, estas haciendo algo mal :/");
      error(`Error ${user.username} es un fan`);
    }
    success(user);
  } else {
    error("Error al dejar de seguir a " + user.username + " " + user.pk);
  }
}
async function follow({ user, credentials, from, error, success }) {
  const { status } = await Api.friendship(credentials, "create", [user]);
  if (status === "success") {
    const { pk } = storage.getUserInfo(credentials.username);
    const localDB = LocalDB(pk);

    if (user.is_private) {
      //Cambiar pending request a true ya que estamo siguiendo una cuenta privada;
      user.pending_request = 1;
      // de todas las stores ?
      const stores = await localDB.stores_of_user(user);
      console.log(stores);
      await localDB.put_user(user, stores);
      success(user);
      return;
    }

    const add_to_idols = async (user) =>
      await localDB.add_user(user, ["following", "idols"]);
    const add_to_friends = async (user) =>
      await localDB.add_user(user, ["following", "friends"]);
    const delete_fan = async (user) =>
      await localDB.delete_user(user.pk, ["fans"]);

    if (from === "idols") {
      //Si lo empiezo a seguir y es un idolo es porque lo deje de seguir y lo tendira que
      //Agregar de nuevo a idolos
      await add_to_idols(user);
    } else if (from === "fans") {
      //Si lo empiezo a seguir y es un fan, lo borro de fans y lo agrego a amigos
      await delete_fan(user);
      await add_to_friends(user);
    } else if (from === "friends") {
      //Si lo empiezo a seguir y es un amigo lo vuelvo a agregar a amigos
      await add_to_friends(user);
    } else if (from === "followers") {
      //Si lo empiezo a seguir y es un seguidor, me fijo si esta en fanes, si es asi
      //lo borro de fans y lo agrego a amigos
      if (await localDB.get_user(user.pk, "fans")) {
        await delete_fan(user);
        await add_to_friends(user);
      } else {
        await add_to_friends(user);
      }
    } else {
      //Si lo empiezo a seguir y es un following, me fijo SI ES un idol, si es asi
      //agregar a following y a idolos; si no lo agrego a amigos
      const in_followers = await localDB.get_user(user.pk, "followers");
      if (in_followers) {
        await delete_fan(user);
        await add_to_friends(user);
      } else await add_to_idols(user);
    }

    success(user);
  } else {
    error("Error al seguir a " + user.username + " " + user.pk);
  }
}

export { unfollow, follow };
