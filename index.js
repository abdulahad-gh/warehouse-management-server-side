const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

//midleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.rwauo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const inventoriesCollection = client.db('inventorie').collection('inventories')
        app.get('/inventories', async (req, res) => {
            const query = {}
            const cursor = inventoriesCollection.find(query)
            const inventories = await cursor.toArray()
            res.send(inventories)
        })

        app.get('/inventories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const inventorie = await inventoriesCollection.findOne(query);
            res.send(inventorie)

        })


        //post
        app.post('/inventories', async (req, res) => {
            const newInventorie = req.body;
            const result = await inventoriesCollection.insertOne(newInventorie);
            res.send(result)
        });


        //update
        app.put('/inventories/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quan: updatedUser.quan,
                }
            };
            const result = await inventoriesCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        //delete
        app.delete('/inventories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoriesCollection.deleteOne(query);
            res.send(result);
        })

        //get elements for every single user
        app.get('/myItems/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const result = await inventoriesCollection.find({ email: email }).toArray();
            res.send(result)

        })

    }
    finally {

    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('laptop-warehouse-server')
})
app.listen(port, () => {
    console.log('server running')
})