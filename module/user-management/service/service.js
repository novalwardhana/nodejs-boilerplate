'use strict'

const db = require("../../../config/postgres/postgres")

class UserManagement {

  // Create:
  async Create(payload) {

    try {

      /* Insert new user */
      const user = await db("users").insert(payload.user).returning("id")
      if (user.length === 0) {
        throw new Error("Failed insert new user data")
      }
      if (user[0].id === undefined) {
        throw new Error("Failed insert new user data")
      }
      const userID = user[0].id

      /* Insert user has roles */
      let userHasRoles = []
      for (const roleID of payload.roles) {
        userHasRoles.push({
          "user_id": userID,
          "role_id": roleID
        })
      }
      await db("user_has_roles").insert(userHasRoles)

      payload.user.id = userID
      return {
        data: payload.user,
        error: null
      }

    } catch (error) {
      return {
        "data": null,
        "error": error
      }
    }

  }

  // GetUser:
  async GetUser(userID) {
    try {
      const user = await db("users").where("id", userID).first()
      if (!user) {
        throw new Error("User not found")
      }
      return {
        Data: user,
        Error: null
      }
    } catch (error) {
      return {
        Data: null,
        Error: error
      }
    }
  }

  // GetUserHasRoles:
  async GetUserHasRoles(userID) {
    try {

      const userHasRoles = await db("user_has_roles")
        .innerJoin("roles", "roles.id", "user_has_roles.role_id")
        .where("user_has_roles.user_id", userID)
        .select("roles.id", "roles.code", "roles.name")
      if (!userHasRoles) {
        throw new Error("User has roles not found")
      }
      return {
        Data: userHasRoles,
        Error: null
      }

    } catch (error) {
      return {
        Data: null,
        Error: error
      }
    }
  }

  // CountData:
  async CountData() {
    try {
      const process = await db("users").count("id")
      if (!process) {
        throw new Error("Failed count users data")
      }
      if (process.length != 1) {
        throw new Error("Failed count users data")
      }
      return {
        Data: parseInt(process[0].count),
        Error: null
      }
    } catch(error) {
      return {
        Data: null,
        Error: error
      }
    }
  }

  // GetData:
  async GetData(page, limit) {

    try {
      const offset = (page -1) * limit
      const sql = `select 
          u.id,
          u.name,
          u.email,
          jsonb_agg(concat('{', 
            '"id"', ':', r.id , ',',
            '"code"', ':', '"', r.code , '",',
            '"name"', ':', '"', r.name , '"',
          '}')::json) as roles
        from users as u
        inner join user_has_roles uhr on u.id = uhr.user_id 
        inner join roles r on uhr.role_id = r.id
        group by u.id, u.name, u.email
        order by u.id desc 
        offset ${offset} limit ${limit}
        `
      const process = await db.raw(sql)
      return {
        Data: process.rows,
        Error: null
      }
    } catch(error) {
      return {
        Data: null,
        Error: error
      }
    }
    
  }

  // Update:
  async Update(id, payload) {
    try {
      const process = await db("users").where("id", id).update(payload)
      if (!process) {
        throw new Error("Failed update users data")
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

  // DeleteUserHasRoles:
  async DeleteUserHasRoles(id) {
    try {
      const process = await db("user_has_roles").where("user_id", id).del()
      if (isNaN(process)) {
        throw new Error("Failed delete user has roles")
      }
      return {
        Data: null,
        Error: null
      }
    } catch(error) {
      return {
        Data: null,
        Error: error
      }
    }
  }

  // CreateUserHasRoles:
  async CreateUserHasRoles(payload) {
    try {
      const process = await db("user_has_roles").insert(payload)
      if (isNaN(process.rowCount)) {
        throw new Error("Failed create user has roles")
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

  // DeleteUser:
  async DeleteUser(id) {
    try {
      const process = await db("users").where("id", id).del()
      if (isNaN(process)) {
        throw new Error("Failed delete user")
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

}

module.exports = new UserManagement()