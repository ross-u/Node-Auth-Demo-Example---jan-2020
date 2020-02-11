var express = require("express");
var router = express.Router();

const authRouter = require("./auth");
const loginRouter = require("./login");
const siteRouter = require("./site-routes");

router.use("/signup", authRouter);
router.use("/login", loginRouter);

router.use("/", siteRouter); // Protected routes


router.get("/", (req, res) => {
  res.render("index", { title: "Basic auth" });
});


module.exports = router;
