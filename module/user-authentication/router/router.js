const express = require("express")
const router = express.Router()
const controller = require("../controller/controller")
const authMiddleware = require("../../../middleware/auth")

router.post("/login", (req, res) => {
  controller.Login(req, res)
})
router.post("/login-test", 
  (req, res, next) => {
   authMiddleware.CheckAuth(req, res, next)
  },
  (req, res) => {
    controller.LoginTest(req, res)
  }
)

module.exports = router