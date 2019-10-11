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

    // Init Data
    app.get('/initdata', (req, res) => {
        db.collection('customer').insertMany([
            { name: 'Jhonny', age: 28 },
            { name: 'Deep', age: 38 },
            { name: 'Bean', age: 19 },
            { name: 'Dora', age: 22 },
            { name: 'Marvel', age: 32 },
            { name: 'Benjamin', age: 32 }
        ]).then((resp) => {
            res.send('Data berhasil di input')
        }).catch(() => {
            res.send('Data init gagal ditambahkan !')
        })
    })

    // GET ONE DATA WITH 'QUERY'
    /*
        1. Kirim pesan error jika user tidak memberikan salah satu atau kedua data (name, age)
            template err = Mohon isi data untuk properti 'name', 'age'
        
        2. Jika data tidak ditemukan, kirim object dg property 'err'
            templat err = Tidak dapat menemukan user dengan nama ... dan umur ...
    */
    app.get('/users/one', (req, res) => {
        let { name, age } = req.query
        age = parseInt(age)
        if (name.length === 0) {
            return res.send('Mohon isi data untuk properti name')
        } else if (isNaN(age)) {
            return res.send('Mohon isi data untuk properti age')
        }
        db.collection('user').findOne({ name, age })
            .then((resp) => {
                if (!resp) {
                    return res.send({
                        err: 'Tidak dapat menemukan user dengan nama : ' + name + ' , umur : ' + age
                    })
                }
                return res.send(resp)
            }).catch((err) => {
                res.send(err)
            })
    })

    // Get all data with 'QUERY'
    /*
       1. Kirim pesan error ketika age kosong / tidak di isi data
       2. Jika data tidak ditemukan maka kirim respon dalam bentuk object yang memiliki propert 'err'
           templat pesan err = Data dengan umur ... tidak di temukan
   */
    app.get('/users/many', (req, res) => {
        let { age } = req.query
        age = parseInt(age)
        if (isNaN(age)) {
            return res.send('Maaf data error')
        }
        db.collection('user').find({ age }).toArray()
            .then((resp) => {
                if (resp.length === 0) {
                    return res.send({
                        err: 'Data dengan umur : ' + age + ' Tidak di temukan'
                    })
                }
                res.send(resp)
            }).catch((err) => {
                res.send(
                    'Data dengan umur'
                )
            })
    })

    // PUT (EDIT) DATA
    app.put('/users/:name', (req, res) => {
        db.collection('user').updateOne({
            name: req.params.name
        }, {
            $set: {
                name: req.body.name,
                age: req.body.age
            }
        }).then((resp) => {
            res.send(resp)
        }).catch((err) => {
            res.send(err)
        })
    })


    // HOME
    app.get('/', (req, res) => {
        res.send('<h1>404 page not found</h1>')
    })

    // Post Data
    /*
      1. Kirim pesan error jika name, role , age kosong
          template err = Tolong isi data 'name', 'role', 'age'
  */
    app.post('/users', (req, res) => {
        let { name, role, age } = req.body
        age = parseInt(age)
        if (name === '' || role === '' || isNaN(age)) {
            return res.send({
                err: 'Tolong isi data yang kosong'
            })
        }
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

    // DELETE ONE USER BY AGE
    app.delete('/users/:age', (req, res) => {
        db.collection('user').deleteOne({ age: parseInt(req.params.age) })
            .then((resp) => {
                res.send({
                    pesan: 'Data berhasil di remove',
                    response: resp
                })
            }).catch((err) => {
                res.send('Data error')
            })
    })
})


// Callback function pada listen akan dijalankan saat berhasil menjalankan API
app.listen(port, () => {
    console.log('Api Berhasil running di port : ' + port)
})
