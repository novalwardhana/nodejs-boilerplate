'use strict'

const express = require("express")
const router = express.Router()
const controller = require("../controller/controller")

router.post("/bulk-insert", (req, res) => {
  controller.BulkInsert(req, res)
})
router.get("/download-csv", (req, res) => {
  controller.ExportCSV(req, res)
})

module.exports = router