'use strict'
const fs = require("fs").promises
const path = require("path")
const process = require("process")
const env = require("../../../config/env/env")

class Controller {

  constructor() {

  }

  // Upload:
  async Upload(req, res) {

    try {

      /* Create directory when not exist */
      const filedir = process.env[env.EnvFileDirectory]
      await fs.mkdir(filedir, {recursive: true})

      /* Upload to directory */
      const date = new Date()
      let filename = date.getFullYear() + "_" + String(date.getMonth() + 1).padStart(2, "0") + "_" + String(date.getDate()).padStart(2, "0") + "_"
      filename += String(date.getHours()).padStart(2, "0") + String(date.getMinutes()).padStart(2, "0") + String(date.getSeconds()).padStart(2, "0") + "_"
      filename += req.files.file.name
      await fs.writeFile(path.join(filedir, filename), req.files.file.data)
      res.status(200).json({status: 200, message: "Success upload file"})

    } catch(error) {

      res.status(200).json({status: 404, message: error.message})

    }
  }

  // Download:
  async Download(req, res) {

    try {

      /* Get filename */
      let filename = req.query.filename
      if (!filename) {
        res.status(200).json({status: 200, message: "filename must be filled"})
        return
      }
      filename = String(filename)
      if (filename.length === 0) {
        res.status(200).json({status: 400, message: "filename must be filled"})
        return
      }

      /* Download file */
      const filedir = process.env[env.EnvFileDirectory]
      res.download(path.join(filedir, filename))
    
    } catch(error) {

      res.status(200).json({status: 404, message: error.message})

    }
  }

}

module.exports = new Controller()