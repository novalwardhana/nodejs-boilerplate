const express = require("express")
const controller = require("../controller/controller")

const router = express.Router()
router.post("/create", (req, res) => {
  controller.Create(req, res)
})
router.get("/get-data", (req, res) => {
  controller.GetData(req, res)
})
router.get("/detail/:id", (req, res) => {
  controller.Detail(req, res)
})
router.put("/update/:id", (req, res) => {
  controller.Update(req, res)
})
router.delete("/delete/:id", (req, res) => {
  controller.Delete(req, res)
})


module.exports = router