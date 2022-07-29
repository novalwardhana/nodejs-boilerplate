'use strict'
const service = require("../service/service")
const md5 = require("crypto-js/md5")
const jwt = require("jsonwebtoken")

class Controller {

  constructor() {
    this.service = service
  }

  // Login:
  async Login(req, res) {

    /* Process get data */
    const email = req.body.email
    const user = await this.service.GetUser(email)
    if (!user) {
      return res.status(200).json({status: 404, message: "User account not found"})
    }

    /* Password check */
    if (md5(req.body.password).toString() !== user.password) {
      return res.status(200).json({status: 404, message: "User password not match"})
    }

    /* Get user role */
    const roles = await this.service.GetRole(user.id)
    if (roles.length == 0) {
      return res.status(200).json({status: 404, message: "User roles not found"})
    }

    /* Generate JSON web token */
    const tokenCreatedAt = Math.ceil((new Date().getTime()) / 1000)
    const tokenExpiredAt = Math.ceil((new Date().getTime() + (24 * 60 * 60 * 1000)) / 1000)
    const jwtData = {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: roles,
      },
      exp: tokenExpiredAt,
      iat: tokenCreatedAt,
      iss: "NodeJS Boilerplate"
    }
    const privateKey = "novalwardhana"
    const jwtAlgorithm = "HS256"
    const jwtString = jwt.sign(jwtData, privateKey, {algorithm: jwtAlgorithm})
    
    /* Response JSON web token */
    return res.status(200).json({
      status: 200,
      message: "Success login and generate JSON Web Token",
      data: jwtString
    })
  }

  //loginTest
  async LoginTest(req, res) {
    return res.status(200).json({
      status: 200,
      message: "Success test login",
      data: {
        user: req.user,
        roles: req.roles
      }
    })
  }
}

module.exports = new Controller()