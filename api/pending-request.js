import { IgApiClient } from "instagram-private-api";
import { authenticate } from "./utils/ipa";

export default async function (req, res) {
  const { auth, users } = req.body;

  const ig = new IgApiClient();
  await ig.state.deserialize(auth);

  for (const user of users) {
    const { follower_count, following_count } = await ig.user.info(user.pk);
    if (follower_count > 0) {
      const followers = await ig.feed.accountFollowers(user.pk).items();
      if (followers.length) user.pending_request = 0;
    } else if (following_count > 0) {
      const following = await ig.feed.accountFollowing(user.pk).items();
      if (following.length) user.pending_request = 0;
    } else {
      //Scrapear y fijarme si el texto es pendiente
    }
  }

  res.status(200).send(users);
  //Obtener el following_count y follower_count del usuario;
  //Obtener la lista de seguidores del usuario;

  //Si la lista de seguidores del usuario no tiene usuarios
  //y el length follower_count es mayor a 0, entonces la cuenta es
  //privada y todavia no me acepto la solicitud.

  //Si following_count & follower_count son 0
  //entonces scrapear el sitio y fijarme si el button dice pendiente
}
