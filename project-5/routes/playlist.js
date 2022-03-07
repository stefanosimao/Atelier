const express = require('express');
const router = express.Router();
module.exports = router;
const fs = require('fs-extra');

router.get('/', function(req, res) {
    res.render("playlist");
});


