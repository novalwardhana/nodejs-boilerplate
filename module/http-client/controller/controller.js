'use strict'
const service = require("../service/service")
const fs = require("fs").promises
const env = require("../../../config/env/env")
const path = require("path")

class Controller {

  constructor() {
    this.service = service
  }

  // Create:
  async Create(req, res) {
    try {

      /* Prepare payload */
      const payload = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
      }

      /* Process */
      const process = await this.service.Create(payload)
      if (process.Error) {
        throw new Error(process.Error.message)
      }
      res.status(200).json({
        status: 200,
        message: "Success insert new data"
      })
    } catch(error) {
      return res.status(200).json({
        status: 404,
        message: error.message
      })
    }
  }

  // GetData:
  async GetData(req, res) {
    try {

      /* Parameter validation */
      const page = parseInt(req.query.page)
      if (isNaN(page)) {
        throw new Error("Page parameter not valid")
      }
      if (page <= 0) {
        throw new Error("Page parameter not valid")
      }
      const limit = parseInt(req.query.limit)
      if (isNaN(limit)) {
        throw new Error("Limit parameter not valid")
      }
      if (limit <= 0) {
        throw new Error("Limit parameter not valid")
      }

      /* Process */
      const process = await this.service.GetData(page, limit)
      if (process.Error) {
        throw new Error(process.Error.message)
      }
      return res.status(200).json({
        status: 200,
        message: "Success get data",
        data: process.Data
      })
      
    } catch (error) {
      res.status(200).json({
        status: 404,
        message: error.message
      })
    }
  }

  // BulkInsert:
  async BulkInsert(req, res) {
    try {

      /* save file to local storage */
      const date = new Date()
      const filedir = process.env[env.EnvHTTPClientDirectory]
      let filename = date.getFullYear() + String(date.getMonth() + 1).padStart(2, "0") + String(date.getDate()).padStart(2, "0") + "_"
      filename += String(date.getHours()).padStart(2, "0") + String(date.getMinutes()).padStart(2, "0") + String(date.getSeconds()).padStart(2, "0") + "_"
      filename += req.files.file.name
      await fs.mkdir(filedir, {recursive: true})
      await fs.writeFile(path.join(filedir, filename), req.files.file.data)

      /* Process */
      const processBulkInsert = await this.service.BulkInsert(filedir, filename)
      if (processBulkInsert.Error) {
        throw new Error(processBulkInsert.Error.message)
      }

      res.status(200).json({
        code: 200, 
        message: "Success bulk insert"
      })

    } catch (error) {
      res.status(200).json({
        code: 404,
        message: error.message
      })
    }
  }

  // DownloadCSV:
  async DownloadCSV(req, res) {
    try {
      const process = await this.service.DownloadCSV()
      if (process.Error) {
        throw new Error(process.Error.message)
      }
      res.download(path.join(process.Data.filedir, process.Data.filename))
    } catch (error) {
      res.status(200).json({
        code: 404,
        message: error.message
      })
    }
  }

}

module.exports = new Controller()