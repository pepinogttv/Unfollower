// import * as Bluebird from "bluebird";
import { IgApiClient } from "instagram-private-api";
// const shttps = require("socks-proxy-agent");
const base64 = require("node-base64-image");

async function getProfilePicInBase64(url) {
  const base64_pic = await base64.encode(url, {
    string: true,
  });
  return `data:image/png;base64,${base64_pic}`;
}

export default async function (req, res) {
  const { username, password } = req.body;
  const ig = new IgApiClient();
  ig.state.generateDevice(username);

  try {
    let user;
    if (password) {
      user = await ig.account.login(username, password);
    } else {
      console.log(process.env.DEF_USER, process.env.DEF_PASSWORD);
      await ig.account.login(process.env.DEF_USER, process.env.DEF_PASSWORD);
      user = await ig.user.usernameinfo(username);
      console.log({ user });
      if (user.is_private)
        throw "Tu cuenta no es publica. Configurala como publica para continuar sin clave";
    }
    user.profile_pic_base64 = await getProfilePicInBase64(user.profile_pic_url);

    const auth = await ig.state.serialize();
    res.status(200).send({
      status: "success",
      data: {
        ...user,
        auth,
      },
    });
  } catch (err) {
    const message =
      typeof err === "string"
        ? err
        : "Tu clave es incorrecta o tienen habilidata la autenticacion en 2 pasos.";
    console.log(err);
    res.status(200).send({
      status: "error",
      data: message,
    });
  }
}
