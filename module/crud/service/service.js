'use strict'

const db = require("../../../config/postgres/postgres")

class Service {

  async Create(payload) {
    const process = await db("persons").insert(payload)
    return process
  }

  async CountData() {
    const process = await db("persons").count("id")
    return process
  }

  async GetData(page, limit) {
    const offset = (page -1) * limit
    const process = await db("persons").orderBy("id", "desc").offset(offset).limit(limit)
    return process
  }

  async Detail({id}) {
    const process = await db("persons").where("id", id)
    return process
  }

  async Update(id, payload) {
    const process = await db("persons").where("id", id).update(payload)
    return process
  }

  async Delete(id) {
    const process = await db("persons").where("id", id).del()
    return process
  }

}

module.exports = new Service()