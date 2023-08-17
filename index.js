const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
// const corsConfig = {
//   origin: '*',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
//   }
//   app.use(cors(corsConfig))
app.use(express.json());


// console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ojgvcnk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect((err) => {
      if(err){
        console.error(err);
        return;
      }
    });

    const productsCollection = client.db('sellHub').collection('products');
    const cardsCollection = client.db('sellHub').collection('cards')


    app.get('/products', async(req, res)=>{
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId (id)};
      const result = await productsCollection.findOne(query);
      res.send(result);

    });

    app.post('/cards', async(req, res) =>{
      const card = req.body;
      const result = await cardsCollection.insertOne(card);
      res.send(result); 
    });


    app.get('/cards', async(req, res) =>{
      const card = cardsCollection.find();
      const result = await card.toArray()
      res.send(result); 
    })

    app.delete('/cards/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await cardsCollection.deleteOne(filter);
      res.send(result); 
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


 app.get('/', (req, res) =>{
    res.send('Sell hub is running');
 })

 app.listen(port, () =>{
    console.log(`Sell hub API is running on port : ${port}`)
 })