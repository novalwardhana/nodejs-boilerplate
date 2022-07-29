'use strict'
const express = require("express")
const router = express.Router()
const controller = require("../controller/controller")

router.post("/upload", (req, res) => {
  controller.Upload(req, res)
})
router.get("/download", (req, res) => {
  controller.Download(req, res)
})

module.exports = router