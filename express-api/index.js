const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors')
const downloadImage = require('../api/download-image');
const getFollowers = require('../api/followers');
const getFollowing = require('../api/following');
const friendship = require('../api/friendship');
const igAuth = require('../api/ig-auth');
const pendingRequest = require('../api/pending-request');
const getUserInfo = require("../api/user-info");
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

router.post('/test', (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

app.use('/api', router)




// import express from 'express';
// import downloadImage from '../api/download-image.js'
// import getFollowers from '../api/followers.js'
// import getFollowing from '../api/following.js'
// import friendship from '../api/friendship.js'
// import igAuth from '../api/ig-auth.js'
// import pendingRequest from '../api/pending-request.js'
// import getUserInfo from "../api/user-info.js"


// const router = express.Router();
// const app = express();

// app.listen(3000, (err) => {
//     if (err) console.log(err);
//     else console.log('Server running in port 3000')
// })

// router.post('/download-image', downloadImage);
// router.post('/followers', getFollowers);
// router.post('/following', getFollowing);
// router.post('/friendship', friendship);
// router.post('/ig-auth', igAuth);
// router.post('/pending-request', pendingRequest);
// router.post('/user-info', getUserInfo);

// app.use('/api', router)




