'use strict'
const db = require("../../../config/postgres/postgres")

class Service {

  // GetUSer:
  async GetUser(email) {
    const data = await db("users").where("email", email).first()
    return data
  }

  // GetRole:
  async GetRole(id) {
    const data = await db("user_has_roles")
      .innerJoin("roles", "roles.id", "user_has_roles.role_id")
      .where("user_has_roles.user_id", id)
      .select("roles.id", "roles.code", "roles.name")
    return data
  }

}

module.exports = new Service()