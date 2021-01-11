const express = require("express");
const router = express.Router();
const hook = require("../controllers/hook.js");

router.post("/flutter", hook.flutter_hook());

module.exports = router;
