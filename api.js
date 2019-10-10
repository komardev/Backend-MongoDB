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
    app.get('/users', (req, res)=>{
        
    })

})







// Callback function pada listen akan dijalankan saat berhasil menjalankan API
app.listen(port, () => {
    console.log('Api Berhasil running di port : ' + port)
}) 