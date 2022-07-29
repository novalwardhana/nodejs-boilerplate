'use strict'

const { param } = require("../router/router")
const service = require("../service/service")

class Controller {

  constructor() {
    this.service = service
  }

  // Create:
  async Create(req, res) {

    try {

      console.info("request: ", req.body)

      /* Create data process */
      const payload = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
      }
      console.info("ini payload: ", payload)
      await this.service.Create(payload)
      res.status(200).json({
        status: 200,
        message: "Success insert data",
        data: payload
      })

    } catch(error) {
      res.status(200).json({
        status: 404, 
        message: error.message
      })
    }

  }

  // GetData:
  async GetData(req, res) {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    /* Count data process */
    const processCountData = await this.service.CountData()
    const totalData = parseInt(processCountData[0]["count"])
    const numberOfPage = Math.ceil(totalData/limit)
    
    /* Get data process */
    const processGetData = await this.service.GetData(page, limit)
    res.status(200).json({
      status: 200,
      message: "Success get data",
      data: {
        page: page,
        limit: limit,
        total_date: totalData,
        number_of_page: numberOfPage,
        data: processGetData
      }
    })

  }

  // Detail:
  async Detail(req, res) {

    /* Get detail data process */
    const data = await this.service.Detail(req.params)
    res.status(200).json({
      status: 200,
      message: "Success get data",
      data: data
    })
  
  }

  // Update:
  async Update(req, res) {

    /* Process update data */
    const id = req.params.id
    const payload = {
      name: req.body.name,
      age: req.body.age,
      address: req.body.address
    }
    await this.service.Update(id, payload)
    payload["id"] = id
    res.status(200).json({
      status: 200,
      message: "success update data",
      data: payload
    })

  }

  // Delete:
  async Delete(req, res) {

    /* Process delete data */
    const id = req.params.id
    await this.service.Delete(id)
    res.status(200).json({
      status: 200,
      message: "Success delete data"
    })

  }
}

module.exports = new Controller()