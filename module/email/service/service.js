'use strict'
const nodemailer = require("nodemailer")
const process = require("process")
const env = require("../../../config/env/env")

class Service {

  // TestConnection:
  async TestConnection() {
    try {

       /* Create transport */
      const transportSecure = (process.env[env.EnvEmailSecure]==="true") ? true : false
      const transport = nodemailer.createTransport({
        host: process.env[env.EnvEmailHost],
        port: parseInt(process.env[env.EnvEmailPort]),
        secure: transportSecure,
        auth: {
          user: process.env[env.EnvEmailUser],
          pass: process.env[env.EnvEmailPassword]
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      /* Test connection */
      const test = await transport.verify()
      if (!test) {
        console.info("test: ", test)
        throw new Error("Error create connection")
      }
      return {
        Data: null,
        Error: null
      }

    } catch (error) {
      return {
        Data: null,
        Error: error
      }
    }
  }
  
  // SendMail:
  async SendMail(email, subject, text) {
    try {

      /* Create transport */
      const transportSecure = (process.env[env.EnvEmailSecure] === "true") ? true : false
      const transport = nodemailer.createTransport({
        host: process.env[env.EnvEmailHost],
        port: parseInt(process.env[env.EnvEmailPort]),
        secure: transportSecure,
        auth: {
          user: process.env[env.EnvEmailUser],
          pass: process.env[env.EnvEmailPassword]
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      /* Send mail */
      await transport.sendMail({
        from: process.env[env.EnvEmailUser],
        to: email,
        subject: subject,
        text: text
      })

      return {
        Data: null,
        Error: null
      }
    } catch (error) {
      return {
        Data: null,
        Error: error
      }
    }
  }

}

module.exports = new Service()