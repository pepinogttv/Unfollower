const downloadImage = require('../api/download-image');
const getFollowers = require('../api/followers');
const getFollowing = require('../api/following');
const friendship = require('../api/friendship');
const igAuth = require('../api/ig-auth');
const pendingRequest = require('../api/pending-request');
const getUserInfo = require("../api/user-info");


const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors')

app.listen(3000, (err) => {
    if (err) console.log(err);
    else console.log('Server running in port 3000')
})

app.use(cors());
app.use(express.json());

router.post('/download-image', downloadImage);
router.post('/followers', getFollowers);
router.post('/following', getFollowing);
router.post('/friendship/:action', friendship);
router.post('/ig-auth', igAuth);
router.post('/pending-request', pendingRequest);
router.post('/user-info', getUserInfo);

app.use('/api', router)




