const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cep75go.mongodb.net/?retryWrites=true&w=majority`;

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

    const productCollection = client.db('productDB').collection('product')
    const mycartCollection = client.db('productDB').collection('myCart')

    app.get('/product', async (req, res)=>{
      const cusor = productCollection.find();
      const result = await cusor.toArray();
      res.send(result)
    })

    app.get('/product/:id', async (req, res)=>{
      const id = req.params.id;
      const qurey = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(qurey);
      res.send(result);
  })

    app.post('/product', async (req, res)=>{
      const newProduct = req.body;
      console.log(newProduct)
      const result = await productCollection.insertOne(newProduct);
      res.send(result)
    })
    
    app.put('/product/:id', async (req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedProduct = req.body;
      const product = {
        $set:{
            name:updatedProduct.name, 
            productType:updatedProduct.productType,
            brand:updatedProduct.brand,
            photo:updatedProduct.photo,
            price:updatedProduct.price, 
            rating:updatedProduct.rating, 
            description:updatedProduct.description

        }
      }
      console.log(product)
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result)
    })

    // send data to my cart 

    // create myCart api

    app.get("/myCart", async (req, res)=>{
      const cusor = mycartCollection.find();
      const myCart = await cusor.toArray();
      res.send(myCart)
    })

    app.get('/myCart/:id', async (req, res)=>{
      const id = req.params.id;
      const qurey = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(qurey);
      res.send(result);
  })

    app.post('/myCart', async (req, res)=>{
      const myCart = req.body;
      console.log(myCart)
      const result = await mycartCollection.insertOne(myCart);
      res.send(result)
    })

    app.delete("/myCart/:id", async (req, res) =>{
      const id = req.params.id;
      console.log({id})
      const qurey = {_id:(id)};
      const result = await mycartCollection.deleteOne(qurey);
      console.log(result)
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


app.get('/', (req, res)=>{
    res.send('Car Server is running')
});

app.listen(port, ()=>{
    console.log(`Car server is runnig this port:${port}`)
})