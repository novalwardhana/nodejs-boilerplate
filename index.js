const express = require("express")
const bodyParser = require("body-parser")
const expressFileupload = require("express-fileupload")
const process = require("process")
const util = require("util")
const dotenv = require("dotenv")
dotenv.config()

const env = require("./config/env/env")
const moduleCRUD = require("./module/crud/router/router")
const moduleUserAuthentication = require("./module/user-authentication/router/router")
const moduleUserManagement = require("./module/user-management/router/router")
const moduleFile = require("./module/file/router/router")
const moduleAdvanceCRUD = require("./module/advance-crud/router/router")
const moduleHTTPClient = require("./module/http-client/router/router")
const moduleEmail = require("./module/email/router/router")

const app = express()
app.use(bodyParser.json())
app.use(expressFileupload())

app.get("/", (req, res) => {
  res.status(200).json({
    "message": "welcome to my API..."
  })
})

app.use("/api/v1/crud", moduleCRUD)
app.use("/api/v1/user-authentication", moduleUserAuthentication)
app.use("/api/v1/user-management", moduleUserManagement)
app.use("/api/v1/file", moduleFile)
app.use("/api/v1/advance-crud", moduleAdvanceCRUD)
app.use("/api/v1/http-client", moduleHTTPClient)
app.use("/api/v1/email", moduleEmail)

app.listen(parseInt(process.env[env.EnvPort]), ()=> {
  console.info(`Start node js application in: ${process.env[env.EnvPort]}`)
})