const base64 = require("node-base64-image");
export default async function (req, res) {
  const { url } = req.body;

  try {
    const imageInBase64 = await base64.encode(url, { string: true });
    res.status(200).send({
      status: "success",
      data: `data:image/png;base64,${imageInBase64}`,
    });
  } catch (err) {
    res.status(200).send({
      status: "error",
      error: err,
    });
  }
}
