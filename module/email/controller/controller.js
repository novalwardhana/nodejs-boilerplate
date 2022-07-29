'use strict'
const service = require("../service/service")

class Controller {

  constructor() {
    this.service = service
  }

  // TestConnection:
  async TestConnection(req, res) {
    try {

      /* Process */
      const process = await this.service.TestConnection()
      if (process.Error) {
        throw new Error(process.Error.message)
      }

      res.status(200).json({
        status: 200,
        message: "Success create mail connection"
      })
    } catch (error) {
      res.status(200).json({
        status: 404,
        message: error.message
      })
    }
  }

  // SendMail:
  async SendMail(req, res) {
    try {

      const email = req.body.email
      const subject = req.body.subject
      const text = req.body.text

      /* Process */
      const process = await this.service.SendMail(email, subject, text)
      if (process.Error) {
        throw new Error(process.Error.message)
      }
      res.status(200).json({
        status: 200,
        message: "Success send email"
      })

    } catch (error) {
      res.status(200).json({
        status: 404,
        message: error.message
      })
    }
  }

}

module.exports = new Controller()