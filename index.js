
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfg6ad4.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('assignment').collection('alltoys');
    const addingCollection = client.db('assignment').collection('addtoys');

    app.get('/alltoys', async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/alltoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {
        projection: { title: 1, price: 1, picture: 1, toy_name: 1, seller_name: 1, seller_email: 1, rating: 1, available_quantity: 1, detail_description: 1 }
      };

      const result = await toyCollection.findOne(query, options)
      res.send(result)
    })
    app.get('/addtoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {
        projection: { title: 1, price: 1, picture: 1, toy_name: 1, seller_name: 1, seller_email: 1, rating: 1, available_quantity: 1, detail_description: 1 }
      };

      const result = await toyCollection.findOne(query, options)
      res.send(result)
    })

    app.get('/addtoys', async (req, res) => {
      console.log(req.query.email)
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await addingCollection.find(query).toArray();
      res.send(result)
    })


    app.post('/addtoys', async (req, res) => {
      const adding = req.body;
      console.log(adding);
      const result = await addingCollection.insertOne(adding);
      res.send(result)
    })

    app.patch('/addtoys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedAdding = req.body;
      console.log(updatedAdding)
      const updateDoc = {
        $set: {
          status: updatedAdding.status
        }
      }
      const result = await addingCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    app.delete('/addtoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addingCollection.deleteOne(query)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`assingment11 server is running on port: ${port}`)
})