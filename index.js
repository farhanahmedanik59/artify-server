const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("working");
});

// connect mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.gq2vs5u.mongodb.net/?appName=Cluster1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //creating Db and collection
    const database = client.db("artify");
    const arts = database.collection("arts");

    // arts related api
    // update art data
    app.patch("/update-art/:id", async (req, res) => {
      const id = req.params.id;
      const form = req.body;
      console.log(form.photoURL);
      const update = {
        $set: {
          artistImageURL: form.imageURL,
          imageURL: form.imageURL,
          title: form.title,
          category: form.category,
          medium: form.medium,
          description: form.description,
          dimensions: form.dimensions,
          price: form.price,
          likes: form.likes,
          visibility: form.visibility,
        },
      };
      const result = await arts.updateOne({ _id: new ObjectId(id) }, update, {});
      res.send(result);
    });

    // my arts
    app.get("/my-arts", async (req, res) => {
      const email = req.query.email;
      const cursor = await arts.find({ userEmail: email });
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete art
    app.delete("/delete-art/:id", async (req, res) => {
      const id = req.headers.id;
      const result = await arts.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    //add art
    app.post("/add-art", async (req, res) => {
      const newArt = req.body;
      const addArt = await arts.insertOne(newArt);
      res.send(addArt);
    });

    // recent arts
    app.get("/recentarts", async (req, res) => {
      const cursor = arts.find().sort({ createdAt: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // all arts
    app.get("/allarts", async (req, res) => {
      const cursor = arts.find({ visibility: "Public" }).sort({ createdAt: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // top artists
    app.get("/arts/topartists", async (req, res) => {
      const curros = arts.find().sort({ likes: -1 }).limit(4);
      const result = await curros.toArray();
      res.send(result);
    });

    // artsBy id
    app.get("/arts/:id", async (req, res) => {
      const id = req.params.id;
      const result = await arts.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server running");
});
