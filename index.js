const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;

const cors=require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wear
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwcqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        // console.log('connected database')
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        // get single api
        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const service=await servicesCollection.findOne(query);
            res.json(service);
        });

        // delete api 
        app.delete('/service/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await servicesCollection.deleteOne(query);
            res.json(result)
        })


        // get api all
        app.get('/services',async(req,res)=>{
            const cursor=servicesCollection.find({});
            const services=await cursor.toArray();
            res.send(services);
        })

        // post api add data /ui thake requist asle e database e dakhabe insert data to the mongo from client site
        app.post('/services', async (req, res) => {
            const service=req.body
          console.log(service)
            const result=await servicesCollection.insertOne(service);
            res.json(result)
        });
    }
    finally {
        //    await client.close
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {

    res.send('running genius car here')
});

app.listen(port, () => {
    console.log('running pot', port)
})