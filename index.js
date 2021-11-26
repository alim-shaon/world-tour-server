const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sqcdt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('world-tour');
        const packagesCollection = database.collection('packages');
        const bookingsCollection = database.collection('bookings');

        // get all package api
        app.get('/packages', async (req, res) => {
            const result = await packagesCollection.find({}).toArray();
            res.send(result)
        });

        // get single package api
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packagesCollection.findOne(query);
            res.send(result);
        });

        // put api for adding new package
        app.post('/addPackage', async (req, res) => {
            const newPackage = req.body;
            const result = await packagesCollection.insertOne(newPackage);
            res.json(result);
        })

        // post bookpackage api
        app.post('/bookpackage', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.json(result);
        });



        // get method for getting every booking data
        app.get('/bookings', async (req, res) => {
            const result = await bookingsCollection.find({}).toArray();
            res.send(result)
        });

        // put api for changing status 
        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const statusUpdate = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: statusUpdate.status
                },
            };
            const result = await bookingsCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })



        // delete api
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        });


    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running travel world server');
});
app.listen(port, () => {
    console.log('listining to port', port);
});