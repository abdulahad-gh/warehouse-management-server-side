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

    }
    finally {

    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('server ok')
})
app.listen(port, () => {
    console.log('server running')
})