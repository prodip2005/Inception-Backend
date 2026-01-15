const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const nodemailer = require('nodemailer');

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
        const usersCollection=db.collection('users')




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





        app.post('/users', async (req, res) => {
            const data = req.body;

            const newData = {
                ...data,
                date: new Date(data.date),
                createdAt: new Date()
            };
            const result = await usersCollection.insertOne(newData);
            res.send(result)
        })



        app.get('/users', async (req, res) => {
            const result = await usersCollection
                .find()
                .sort({ createdAt: -1 })
                .toArray();

            res.send(result);
        });


        // ইমেইল ট্রান্সপোর্টার সেটআপ (পাসওয়ার্ড হিসেবে App Password ব্যবহার করুন)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let otpStore = {}; // সাময়িক ওটিপি সেভ রাখার জন্য

        // API 1: ওটিপি জেনারেট এবং ইমেইল পাঠানো
        app.post('/send-otp', async (req, res) => {
            const userData = req.body;
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // ডাটা সাময়িকভাবে সেভ রাখা
            otpStore[userData.email] = { ...userData, otp };

            const mailOptions = {
                from: `"Inception Movement" <${process.env.EMAIL_USER}>`,
                to: userData.email,
                subject: 'Verification Code for Inception',
                html: `<div style="font-family: monospace; background: #000; color: #fff; padding: 20px; border: 1px solid #d22f27;">
                <h2>Inception Registry Code</h2>
                <p>Your 6-digit verification code is:</p>
                <h1 style="color: #d22f27; letter-spacing: 5px;">${otp}</h1>
                <p>This code will expire soon.</p>
               </div>`
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) return res.status(500).send({ success: false, message: 'Email failed' });
                res.send({ success: true, message: 'OTP Sent' });
            });
        });

        // API 2: ওটিপি চেক এবং ডাটাবেজ সেভ
        app.post('/verify-and-save', async (req, res) => {
            const { email, otp } = req.body;
            const record = otpStore[email];

            if (record && record.otp === otp) {
                const { otp, ...finalData } = record;
                const result = await usersCollection.insertOne({
                    ...finalData,
                    createdAt: new Date()
                });
                delete otpStore[email]; // ব্যবহারের পর মুছে ফেলা
                res.send({ success: true, result });
            } else {
                res.status(400).send({ success: false, message: 'Invalid OTP Code' });
            }
        });




      
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
