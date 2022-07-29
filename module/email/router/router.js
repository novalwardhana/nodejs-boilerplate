'use strict'
const express = require("express")
const router = express.Router()
const controller = require("../controller/controller")

router.get("/test-connection", (req, res, next) => {
  controller.TestConnection(req, res)
})
router.post("/send-mail", (req, res, next) => {
  controller.SendMail(req, res)
})
router.post("/send-mail-advance", (req, res, next) => {
  
})

module.exports = router