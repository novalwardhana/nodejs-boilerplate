'use strict'

const service = require("../service/service")
const md5 = require("crypto-js/md5")

class UserManagement {

  constructor() {
    this.service = service
  }

  // Create:
  async Create(req, res) {

    /* User role check */
    var isGrant = false
    for (const role of req.roles) {
      if (role.code === "root" || role.code === "admin") {
        isGrant = true
      }
    }
    if (!isGrant) {
      res.status(200).json({status: 404, message: "User not have access to create new user"})
      return
    }

    /* Process create data */
    const payload = {
      user: {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password).toString()
      },
      roles: req.body.roles
    }
    const processCreate = await this.service.Create(payload)
    if (processCreate.error) {
      return res.status(200).json({status: 404, message: processCreate.error.message})
    }

    res.status(200).json({
      status: 200,
      message: "Success insert new user",
      data: result.data
    })
  }

  // Detail:
  async Detail(req, res) {

    /* User role check */
    var isGrant = false
    for (const role of req.roles) {
      if (role.code === "root" || role.code === "admin") {
        isGrant = true
        break
      }
    }
    if (req.user.id === parseInt(req.params.id)) {
      isGrant = true
    }
    if (!isGrant) {
      res.status(200).json({status: 404, message: "User not have access to get information"})
      return
    }

    /* Process get user */
    const processGetUser = await this.service.GetUser(parseInt(req.params.id))
    if (processGetUser.Error) {
      res.status(200).json({status: 404, message: "User not found"})
      return
    }
    const user = processGetUser.Data
    delete user["password"]
    
    /* Process get user has roles */
    const processUserHasRoles = await this.service.GetUserHasRoles(parseInt(req.params.id))
    if (processUserHasRoles.Error) {
      res.status(200).json({status: 404, message: "User has roles not found"})
      return
    } 
    const roles = processUserHasRoles.Data

    res.status(200).json({
      status: 200,
      message: "Success get detail user information",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: roles
      }
    })
  }

  // GetData:
  async GetData(req, res) {

    /* User role check */
    var isGrant = false
    for (const role of req.roles) {
      if (role.code === "root" || role.code === "admin") {
        isGrant = true
        break
      }
    }
    if (!isGrant) {
      res.status(200).json({staus: 400, message: "User not have access to get data"})
      return
    }

    /* Page and limit validation */
    let page = 0
    let limit = 0
    try {
      page= parseInt(req.query.page)
      limit = parseInt(req.query.limit)
      if (isNaN(page) || isNaN(limit)) {
        throw new Error("Page or limit parameter is not valid")
      }
      if (page <= 0 || limit <= 0) {
        throw new Error("Page or limit parameter is not valid")
      }
    } catch (error) {
      res.status(200).json({status: 400, message: error.message})
      return
    }

    /* Process count data */
    const processCountData = await this.service.CountData()
    if (processCountData.Error) {
      res.status(200).json({status: 404, message: processCountData.Error.message})
      return
    }
    const totalData = processCountData.Data
    const numberOfPage = parseInt(Math.ceil(totalData/limit))
    
    /* Process get data */
    const processGetData = await this.service.GetData(page, limit)
    if (processGetData.Error) {
      res.status(200).json({status: 404, message: processGetData.Error.message})
      return
    }
    const data = processGetData.Data
    

    res.status(200).json({
      page: page, 
      limit: limit,
      total_Data: totalData, 
      number_of_page: numberOfPage,
      data: data
    })
  }

  // Update:
  async Update(req, res) {

    /* User role check */
    var isGrant = false
    for (const role of req.roles) {
      if (role.code === "root" || role.code === "admin") {
        isGrant = true
        break
      }
    }
    if (req.user.id === parseInt(req.params.id)) {
      isGrant = true
    }
    if (!isGrant) {
      res.status(200).json({status: 400, message: "User not have access to update data"})
      return
    }

    /* Process update data */
    const payload = {
      name: req.body.name,
      password: md5(req.body.password).toString()
    }
    const processUpdate = await this.service.Update(parseInt(req.params.id), payload)
    if (processUpdate.Error) {
      res.status(200).json({status: 404, message: processUpdate.Error.message})
      return
    }
    
    /* Process delete user has roles */
    const processDeleteUserHasRoles = await this.service.DeleteUserHasRoles(parseInt(req.params.id))
    if (processDeleteUserHasRoles.Error) {
      res.status(200).json({status: 404, message: processDeleteUserHasRoles.Error.message})
      return
    }

    /* Process create user has roles */
    const userHasRoles = []
    for (const roleID of req.body.roles) {
      const userHasRole = {
        user_id: parseInt(req.params.id),
        role_id: roleID
      }
      userHasRoles.push(userHasRole)
    }
    const processCreateUserHasRoles = await this.service.CreateUserHasRoles(userHasRoles)
    if (processDeleteUserHasRoles.Error) {
      res.status(200).json({status: 404, message: processCreateUserHasRoles.Error.message})
      return
    }

    /* Process get user has roles */
    const processGetUserHasRoles = await this.service.GetUserHasRoles(parseInt(req.params.id))
    if (processGetUserHasRoles.Error) {
      res.status(200).json({status: 404, message: processGetUserHasRoles.Error.message})
      return
    }
    const roles = processGetUserHasRoles.Data

    res.status(200).json({
      id: parseInt(req.params.id),
      name: req.body.name,
      email: req.body.email,
      roles: roles
    })
  }

  // Delete:
  async Delete(req, res) {

    /* User role check */
    var isGrant = false
    for (const role of req.roles) {
      if (role.code === "root" || role.code === "admin") {
        isGrant = true
        break
      }
    }
    if (!isGrant) {
      res.status(200).json({status: 400, message: "User not have access to delete data"})
      return
    }

    /* Process get user has roles */
    const processGetUserHasRoles = await this.service.GetUserHasRoles(parseInt(req.params.id))
    if (processGetUserHasRoles.Error) {
      res.status(200).json({status: 404, message: processGetUserHasRoles.Error.message})
      return
    }
    const roles = processGetUserHasRoles.Data
    for (const role of roles) {
      if (role.code === "root" || role.code === "admin") {
        res.status(200).json({status: 404, message: "Cannot delete user with role root or admin"})
        return
      }
    }

    /* Process delete user has roles */
    const processDeleteUserHasRoles = await this.service.DeleteUserHasRoles(parseInt(req.params.id))
    if (processDeleteUserHasRoles.Error) {
      res.status(200).json({status: 404, message: processDeleteUserHasRoles.Error.message})
      return
    }

    /* Process delete user */
    const processDeleteUser = await this.service.DeleteUser(parseInt(req.params.id))
    if (processDeleteUser.Error) {
      res.status(200).json({status: 404, message: processDeleteUser.Error.message})
      return
    }

    res.status(200).json({
      status: 200,
      message: "Success delete user"
    })

  }

}

module.exports = new UserManagement()