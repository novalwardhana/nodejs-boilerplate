'use strict'
const db =  require("../../../config/postgres/postgres")

class Service {

  // Insert:
  async Insert(payload) {

    try {
      const process = await db("persons").insert(payload)
      if (isNaN(process.rowCount)) {
        throw new Error("Failed create new data")
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

  // GetData:
  async GetData(exportData) {
    try {
      const process = await db("persons").select("id", "name", "age", "address").orderBy("id", "asc")
      exportData.data = process
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