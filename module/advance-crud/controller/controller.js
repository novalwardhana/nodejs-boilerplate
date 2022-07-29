'use strict'
const fs = require("fs").promises
const path = require("path")
const process = require("process")
const env = require("../../../config/env/env")
const service = require("../service/service")

class Controller {

  constructor() {
    this.service = service
  }

  // BulkInsert
  async BulkInsert(req, res) {

    try {
      /* Prepare file directory */
      const filedir = process.env[env.EnvAdvanceCrudDirectory]
      await fs.mkdir(filedir, {recursive: true})

      /* Upload file */
      if (!req.files.file) {
        res.status(200).json({status: 404, message: "File must uploaded"})
        return
      }
      const date = new Date()
      let filename = date.getFullYear() + String(date.getMonth() + 1).padStart(2, "0") + String(date.getDate()).padStart(2, "0") + "_"
      filename += String(date.getHours()).padStart(2, "0") + String(date.getMinutes()).padStart(2, "0") + String(date.getSeconds()).padStart(2, "0") + "_"
      filename += req.files.file.name
      const filenameArray = String(filename).split(".")
      if (filenameArray[1] !== "csv") {
        res.status(200).json({status: 404, message: "Must upload file in csv format"})
        return
      }
      await fs.writeFile(path.join(filedir, filename), req.files.file.data)

      /* Process file */
      const file = await fs.readFile(path.join(filedir, filename))
      const fileString = file.toString()
      const fileArray = fileString.split("\n")
      fileArray.shift()
      for (const data of fileArray) {
        const dataArray = data.split(",")
        if (dataArray.length < 3) {
          continue
        }
        dataArray[2] = dataArray[2].replace("\r","")
        const payload = {
          name: dataArray[0],
          age: parseInt(dataArray[1]),
          address: dataArray[2]
        }
        const processInsert = await this.service.Insert(payload)
        if (processInsert.Error) {
          console.info("Error occured: ", processInsert.Error.message)
        }
      }

      res.status(200).json({"status": 200, message: "Success bulk insert"})

    } catch(error) {
      res.status(200).json({status: 404, message: error.message})
    }
  }

  // ExportCSV:
  async ExportCSV(req, res) {

    try {

      /* Declare pointer/reference object */
      const exportData = {
        data: []
      }

      /* Process get data */
      const processGetData = await this.service.GetData(exportData)
      if (processGetData.Error) {
        throw new Error(processGetData.Error.message)
      }

      /* Compose CSV data */
      let csvData = ""
      csvData += "ID,NAME,AGE,ADDRESS\n"
      for (const data of exportData.data) {
        csvData += data.id + "," + data.name + "," + data.age + "," + data.address + "\n"
      }

      /* Save data into CSV */
      const filedir = process.env[env.EnvAdvanceCrudDirectory]
      const date = new Date()
      let filename = date.getFullYear() + String(date.getMonth()+1).padStart(2, "0") + String(date.getDate()).padStart(2, "0") + "_"
      filename += String(date.getHours()).padStart(2, "0") + String(date.getMinutes()).padStart(2, "0") + String(date.getSeconds()).padStart(2, "0")
      filename += "_Download_Data.csv"
      const csvBuffer = Buffer.from(csvData)
      await fs.writeFile(path.join(filedir, filename), csvBuffer)
      
      res.status(200).download(path.join(filedir, filename), )

    } catch (error) {
      res.status(200).json({status: 404, message: error.message})
    }

  }

}

module.exports = new Controller()