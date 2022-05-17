import Api from "../services/Api";
import UsersDB from "./RelatedUsersDB";

async function whatIs(user, DB) {
  const [isFan, isIdol, isFriend] = await Promise.all([
    DB.getUser(user.pk, "fans"),
    DB.getUser(user.pk, "idols"),
    DB.getUser(user.pk, "friends"),
  ]);
  if (isFan) return "fan";
  else if (isIdol) return "idol";
  else if (isFriend) return "friend";
  return null;
}

async function unfollow({ user, auth, pk }) {
  const ERROR_MESSAGE = `Error no se pudo dejar de seguir a ${user.username}`;
  const { status } = await Api.friendship(auth, "destroy", [user]);
  if (status !== "success") return ERROR_MESSAGE;

  const DB = await UsersDB(pk);
  const is = await whatIs(user, DB);

  switch (is) {
    case "fan":
      //Si estoy dejando de seguir a un fan es porque lo empece a seguir, por lo tanto esta es mis amigos.
      await DB.deleteUser(user, ["following", "friends"]);
      await DB.addUser(user, ["fans"]);
      break;
    case "idol":
      await DB.deleteUser(user, ["following", "idols"]);
      break;
    case "friend":
      await DB.deleteUser(user, ["following", "friends"]);
      break;
    default:
      return `${ERROR_MESSAGE}. No lo sigues.`;
  }
}
async function follow({ user, auth, pk }) {
  const ERR_MESSAGE = `Error no se pudo seguir a ${user.username}.`;
  const { status } = await Api.friendship(auth, "create", [user]);
  if (status !== "success") return `API ERROR: ${ERR_MESSAGE}`;

  const DB = await UsersDB(pk);
  const is = await whatIs(user, DB);

  switch (is) {
    case "fan":
      await DB.deleteUser(user, ["fans"]);
      await DB.addUser(user, ["friends"]);
      break;
    case "idol":
      await DB.addUser(user, ["following", "idols"]);
      break;
    case "friend":
      await DB.deleteUser(user, ["fans"]);
      await DB.addUser(user, ["friends"]);
      break;
    default:
      await DB.addUser(user, ["following", "idols"]);
      break;
  }
}

async function deletef({ user, auth, pk }) {
  const ERR_MESSAGE = `Error no se pudo eliminar a ${user.username} de tus seguidores.`;
  const { status } = await Api.friendship(auth, "removeFollower", [user]);
  if (status !== "success") ERR_MESSAGE;

  const DB = await UsersDB(pk);
  const is = await whatIs(user, DB);

  switch (is) {
    case "fan":
      await DB.deleteUser(user, ["followers", "fans"]);
      break;
    case "idol":
      return {
        error: `No puedes eliminar de tus seguidores a ${user.username} porque no te sigue.`,
      };
    case "friend":
      await DB.deleteUser(user, ["followers", "friends"]);
      await DB.addUser(user, ["idols"]);
      break;
    default:
      return ERR_MESSAGE;
  }
}

async function block({ user, auth, pk }) {
  const ERR_MESSAGE = `Error, no se pudo bloquear a ${user.username}.`;
  const { status } = await Api.friendship(auth, "block", [user]);
  if (status !== "success") return ERR_MESSAGE;
  const DB = await UsersDB(pk);
  const storesOfUser = await DB.getUserStoreNames(user);
  await DB.deleteUser(user, storesOfUser);
}

async function unblock({ user, auth }) {
  const { status } = await Api.friendship(auth, "unblock", [user]);
  if (status !== "success")
    return `Error, no se pudo bloquear a ${user.username}`;
}

export default { unfollow, follow, deletef, block, unblock };
