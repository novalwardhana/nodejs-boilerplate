'use strict'
const http = require("http")
const process = require("process")
const env = require("../../../config/env/env")
const fs = require("fs").promises
const { createReadStream, createWriteStream } = require("fs")
const path = require("path")
const formData = require("form-data")

class Service {

  // Create:
  async Create(payload) {
    try {

      /* HTTP client */
      const doRequest = (url, payload) => {
        return new Promise((resolve, reject) => {
          const request = http.request(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
          }, (response) => {
            if (response.statusCode === 200) {
              response.addListener("data", data => {
                const parseResponse = JSON.parse(data.toString())
                if (parseResponse.status !== 200) {
                  reject(new Error(parseResponse.message))
                }
                resolve(data)
              })
            } else {
              reject(new Error("Error create new data"))
            }
          })
          request.on("error", err => {
            reject(err)
          })

          request.write(JSON.stringify(payload))
          request.end()
        })
      }

      /* Process */
      const url = new URL(process.env[env.EnvHTTPClientURL]+"/crud/create")
      const result = await doRequest(url, payload)
      if (result) {
        return {
          Data: null,
          Error: null
        }
      } else {
        throw new Error("Failed create new data")
      }

    } catch (error) {
      return {
        Data: null,
        Error: error
      }
    }
  }

  // GetData:
  async GetData(page, limit) {

    try {

      /* http client */
      const doRequest = (url) => {
        return new Promise((resolve, reject) => {
          const request = http.request(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          }, (response) => {
            if (response.statusCode === 200) {
              response.addListener("data", data => {
                const parseResponse = JSON.parse(data.toString())
                if (parseResponse.status !== 200) {
                  reject(new Error(parseResponse.message))
                }
                resolve(parseResponse)
              })
            } else {
              reject(new Error("Error get data"))
            }
          })
          request.on("error", err => {
            reject(err)
          })
          request.end()
        })
      }

      /* Process */
      let url = new URL(process.env[env.EnvHTTPClientURL]+"/crud/get-data")
      url.searchParams.append("page", page)
      url.searchParams.append("limit", limit)
      const result = await doRequest(url)
      if (result) {
        return {
          Data: result.data,
          Error: null
        }
      } else {
        throw new Error(process)
      }
    } catch(error) {
      return {
        Data: null,
        Error: error
      }
    }
  }

  // BulkInsert:
  async BulkInsert(filedir, filename) {
    try {

      /* HTTP CLient */
      const doRequest = (url, filedir, filename) => {
        return new Promise((resolve, reject) => {

          const readStream = createReadStream(path.join(filedir, filename))
          const writeStream = createWriteStream(path.join(filedir, "text-stream.txt"))
          const form = new formData()
          form.append("file", readStream)

          const request = http.request(url, {
            method: "POST",
            headers: form.getHeaders()
          }, (response) => {
            response.addListener("data", data => {
              const parseResponse = JSON.parse(data.toString())
              if (parseResponse.status !== 200) {
                reject(new Error(parseResponse.message))
              }
              resolve(parseResponse.message)
            })
          })
          form.pipe(request)
        })
      }

      /* Process */
      const url = process.env[env.EnvHTTPClientURL] + "/advance-crud/bulk-insert"
      const result = await doRequest(url, filedir, filename)
      if (result) {
        return {
          Data: null,
          Error: null
        }
      } else {
        throw new Error("Failed bulk insert")
      }

    } catch (error) {
      return {
        Data: null,
        Error: error
      }
    }
  }

  // DownloadCSV:
  async DownloadCSV() {
    try {
      
      /* HTTP request */
      const doRequest = (url) => {
        console.info("url: ", url)
        return new Promise((resolve, reject) => {
          const request = http.request(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          }, (response) => {
            response.addListener("data", data => {
              resolve(data)
            })
          })
          request.on("error", err => {
            reject(err)
          })
          request.end()
        })
      }

      /* Process */
      const url = process.env[env.EnvHTTPClientURL] + "/advance-crud/export-csv"
      const result = await doRequest(url)
      if (!result) {
        throw new Error("Failed download csv")
      }
      const date = new Date()
      let filename = date.getFullYear() + String(date.getMonth() + 1).padStart(2, "0") + String(date.getDate()).padStart(2, "0") + "_"
      filename += String(date.getHours()).padStart(2, "0") + String(date.getMinutes()).padStart(2, "0") + String(date.getSeconds()).padStart(2, "0") + "_"
      filename += "export_csv.csv"
      await fs.writeFile(path.join(process.env[env.EnvHTTPClientDirectory], filename), result)
      return {
        Data: {
          filedir: process.env[env.EnvHTTPClientDirectory],
          filename: filename
        },
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