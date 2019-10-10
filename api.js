// Api Config
const express = require('express')
const app = express()
const port = 2001

app.use(express.json())

//  MongoDB Config
const mongodb = require('mongodb')
// Membuat koneksi ke mongodb
const MongoClient = mongodb.MongoClient

const URL = "mongodb://127.0.0.1:27017"
const databaseName = "bdg-mongodb"
MongoClient.connect(URL, {}, (err, client) => {
    if (err) {
        return console.log(err);
    }
    const db = client.db(databaseName)
})







// Callback function pada listen akan dijalankan saat berhasil menjalankan API
app.listen(port, () => {
    console.log('Api Berhasil running di port : ' + port)
}) 