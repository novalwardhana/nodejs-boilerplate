const knex = require("knex")
const process = require("process")
const env = require("../env/env")

const db = knex({
  client: "pg",
  version: "11.15",
  connection: {
    host: process.env[env.EnvDBMasterHost],
    port: process.env[env.EnvDBMasterPort],
    user: process.env[env.EnvDBMasterUser],
    password: process.env[env.EnvDBMasterPassword],
    database: process.env[env.EnvDBMasterName]
  },
  pool: {
    min: parseInt(process.env[env.EnvDBMasterPoolMin]),
    max: parseInt(process.env[env.EnvDBMasterPoolMax])
  },
  debug: Boolean(process.env[env.EnvDBMasterDebug])
})

module.exports = db