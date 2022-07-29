'use strict'
const express = require("express")
const router = express.Router()
const controller = require("../controller/controller")

router.post("/crud/create", (req, res) => {
  controller.Create(req, res)
})
router.get("/crud/get-data", (req, res) => {
  controller.GetData(req, res)
})
router.post("/advance-crud/bulk-insert", (req, res) => {
  controller.BulkInsert(req, res)
})
router.get("/advance-crud/download-csv", (req, res) => {
  controller.DownloadCSV(req, res)
})

module.exports = router