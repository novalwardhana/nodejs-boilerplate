'use strict'

const express = require("express")
const router = express.Router()
const authMiddleware = require("../../../middleware/auth")
const controller = require("../controller/controller")

router.post("/create",
  (req, res, next) => {
    authMiddleware.CheckAuth(req, res, next)
  },
  (req, res) => {
    controller.Create(req, res)
  }
)
router.get("/detail/:id",
  (req, res, next) => {
    authMiddleware.CheckAuth(req, res, next)
  },
  (req, res) => {
    controller.Detail(req, res)
  }
)
router.get("/get-data",
  (req, res, next) => {
    authMiddleware.CheckAuth(req, res, next)
  },
  (req, res) => {
    controller.GetData(req, res)
  }
)
router.put("/update/:id",
  (req, res, next) => {
    authMiddleware.CheckAuth(req, res, next)
  },
  (req, res) => {
    controller.Update(req, res)
  }
)
router.delete("/delete/:id",
  (req, res, next) => {
    authMiddleware.CheckAuth(req, res, next)
  },
  (req, res) => {
    controller.Delete(req, res)
  }
)

module.exports = router