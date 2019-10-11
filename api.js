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
MongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        return console.log(err);
    }
    const db = client.db(databaseName)

    // HOME
    app.get('/', (req,res)=>{
        res.send('<h1>404 page not found</h1>')
    })

    // Post Data
    app.post('/users', (req, res) => {
        let { name, role, age } = req.body
        db.collection('user').insertOne({ name, role, age })
            .then((resp) => {
                res.send({
                    pesan: 'Data berhasil di input',
                    response: resp
                })
            }).catch((err) => {
                res.send(err)
            })
    })

    // Get Data
    app.get('/users', (req, res) => {
        db.collection('user').find({}).toArray()
            .then((resp) => {
                // isi dari resp = [{},{},{}]
                if (resp.length === 0) {
                    return res.send({
                        Message: 'Data Kosong !'
                    })
                }
                res.send(resp)
            }).catch((err) => {
                res.send(err)
            })
    })
})







// Callback function pada listen akan dijalankan saat berhasil menjalankan API
app.listen(port, () => {
    console.log('Api Berhasil running di port : ' + port)
}) 