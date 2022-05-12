import { IgApiClient } from "instagram-private-api";

export default async function (req, res) {
  console.time("GET ONE USER INFO");
  const { auth, pk } = req.body;

  const ig_client = new IgApiClient();
  await ig_client.state.deserialize(auth);

  try {
    const info = await ig_client.user.info(pk);
    console.timeEnd("GET ONE USER INFO");
    res.status(200).send({
      status: "success",
      data: info,
    });
  } catch (error) {
    res.status(200).send({
      status: "error",
      error,
    });
  }
}
