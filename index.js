const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()

const port=process.env.PORT || 3000

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d5x0yu5.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        
        // await client.connect();

        const db = client.db('timelineDB');
        const timelineCollection = db.collection('timeline');
        const institutionCollection=db.collection('institutions')
        const peopleCollection=db.collection('peoples')




        // TimeLine Data All Operations
        app.post('/timeline', async (req, res) => {
            const data = req.body;

            const newData = {
                ...data,
                date: new Date(data.date), 
                createdAt: new Date()
            };
            const result = await timelineCollection.insertOne(newData);
            res.send(result)
        })


        app.get('/timeline', async (req, res) => {
            const result = await timelineCollection
                .find()
                .sort({ date: -1 })
                .toArray();

            res.send(result);
        });



        app.get('/timeline/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await timelineCollection.findOne(query);
            res.send(result)
        })


        app.patch('/timeline/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;

            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updateData
            };
            const result = await timelineCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        app.delete('/timeline/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await timelineCollection.deleteOne(query);
            res.send(result);
        })





        // Institutions Data
        app.post('/institutions', async (req, res) => {
            const data = req.body;

            const newData = {
                ...data,
                date: new Date(data.date),
                createdAt: new Date()
            };
            const result = await institutionCollection.insertOne(newData);
            res.send(result)
        })


        app.get('/institutions', async (req, res) => {
            const result = await institutionCollection
                .find()
                .sort({ date: -1 })
                .toArray();

            res.send(result);
        });



        app.patch('/institutions/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;

            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updateData
            };
            const result = await institutionCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        app.delete('/institutions/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await institutionCollection.deleteOne(query);
            res.send(result);
        })





        // Peoples Data
        app.post('/peoples', async (req, res) => {
            const data = req.body;

            const newData = {
                ...data,
                date: new Date(data.date),
                createdAt: new Date()
            };
            const result = await peopleCollection.insertOne(newData);
            res.send(result)
        })


        app.get('/peoples', async (req, res) => {
            const result = await peopleCollection
                .find()
                .sort({ date: -1 })
                .toArray();

            res.send(result);
        });



        app.patch('/peoples/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;

            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updateData
            };
            const result = await peopleCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        app.delete('/peoples/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await peopleCollection.deleteOne(query);
            res.send(result);
        })




      
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);











app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
