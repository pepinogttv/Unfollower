module.exports = function (req, res) {
    const { username, password } = req.body;
    res.send({ username, password })
}