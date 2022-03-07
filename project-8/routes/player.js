const express = require('express');
const router = express.Router();
module.exports = router;
const fs = require('fs-extra');

router.get('/remote', function(req, res) {
    res.render("player");
});


