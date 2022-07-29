const jsonwebtoken = require("jsonwebtoken")
const db = require("../config/postgres/postgres")

// Auth:
class Auth {

  // CheckAuth:
  async CheckAuth(req, res, next) {
    let tokenArray

    /* Check headers auth is null */
    if (!req.headers.authorization) {
      return res.status(200).json({
        status: 400,
        message: "JWT is null"
      })
    }

    /* Check bearer */
    if (!req.headers.authorization.startsWith("Bearer")) {
      return res.status(200).json({
        status: 400,
        message: "JWT is invalid"
      })
    }

    /* Check jwt length */
    tokenArray = req.headers.authorization.split(" ")
    if (tokenArray.length <= 1) {
      return res.status(200).json({
        status: 400,
        message: "JWT is invalid"
      })
    }

    /* Process decode */
    try {
      const token = tokenArray[1]
      const jwtAlgorithm = "HS256"
      const decodedToken = jsonwebtoken.verify(token, "novalwardhana", {algorithms: [jwtAlgorithm]})
    

      /* Check if token expired */
      const unixNow = Math.ceil(new Date().getTime() / 1000)
      if (unixNow >= decodedToken.exp) {
        throw new Error("Token expired")
      }

      /* Check if user exist or not */
      const userData = await db("users").where("email", decodedToken.data.email)
      if (!userData) {
        throw new Error("User not found")
      }
      if (userData.length == 0) {
        throw new Error("User not found")
      }

      /* Next route */
      req.user = {
        id: decodedToken.data.id,
        name: decodedToken.data.name,
        email: decodedToken.data.email,
      }
      req.roles = decodedToken.data.roles
      next()

    } catch (error) {
      return res.status(200).json({status: 400, message: error.message})
    }

  }

  // CheckAuthWithCallback:
  async CheckAuthWithCallback(req, res, next) {
    let tokenArray

    /* Check headers auth is null */
    if (!req.headers.authorization) {
      return res.status(200).json({
        status: 400,
        message: "JWT is null"
      })
    }

    /* Check bearer */
    if (!req.headers.authorization.startsWith("Bearer")) {
      return res.status(200).json({
        status: 400, 
        message: "JWT is invalid"
      })
    }

    /* Check jwt length */
    tokenArray = req.headers.authorization.split(" ")
    if (tokenArray.length <= 1) {
      return res.status(200).json({
        status: 400,
        message: "JWT is invalid"
      })
    }


    /* Process decode */
    try {
      const token = tokenArray[1]
      const jwtAlgorithm = "HS256"
      jsonwebtoken.verify(token, "novalwardhana", {algorithms: [jwtAlgorithm]}, async (err, payload) => {
        if (err) {
          throw new Error(err.message)
        }

        /* Check if token expired */
        const unixNow = Math.ceil(new Date().getTime() / 1000)
        if (unixNow >= payload.exp) {
          throw new Error("Token expired")
        }

        /* Check if user exist or not */
        db("users").where("email", payload.data.email).then((result) => {
          if (!result) {
            throw new Error("User not found")
          }
          if (result.length == 0) {
            throw new Error("User not found")
          }
        }).catch((error) => {
          throw new Error(error.message)
        })


        /* Next route */
        req.user = {
          id: payload.data.id,
          name: payload.data.name,
          email: payload.data.email
        }
        req.roles = payload.data.roles

      })

      console.info("req: ", req.user)

      await next()
    } catch (error) {
      return res.status(200).json({
        status: 400,
        message: error.message
      })
    }

  }

}

module.exports = new Auth()