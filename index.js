const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(
  cors({
    origin: "https://assignment10-297ce.web.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
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
    // await client.connect();

    //creating Db and collection
    const database = client.db("artify");
    const arts = database.collection("arts");
    const favouriteCollection = database.collection("favourite");

    // arts related api

    app.patch("/arts/like/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const updateResult = await arts.updateOne({ _id: new ObjectId(id) }, { $inc: { likes: 1 } });

        if (updateResult.matchedCount === 0) {
          return res.status(404).send({ success: false, message: "Art not found" });
        }

        const updatedArt = await arts.findOne({ _id: new ObjectId(id) });

        await favouriteCollection.updateMany({ artwordId: id }, { $set: { likes: updatedArt.likes } });

        res.send({ success: true, likes: updatedArt.likes });
      } catch (error) {
        console.error("Error updating likes:", error);
        res.status(500).send({ success: false, message: "Error updating likes" });
      }
    });

    // update art data
    app.patch("/update-art/:id", async (req, res) => {
      const id = req.params.id;
      const form = req.body;
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
      try {
        favouriteCollection.updateMany({ artwordId: id }, update, {});
      } catch {}
      res.send(result);
    });

    // remove favourite
    app.delete("/favorites/:id", async (req, res) => {
      const email = req.query.email;
      const id = req.query.id;
      const result = await favouriteCollection.deleteOne({ artwordId: id, favorite: email });
      res.send(result);
    });

    // get favorite
    app.get("/favorites", async (req, res) => {
      const email = req.query.email;
      const cursor = favouriteCollection.find({ favorite: email });
      const result = await cursor.toArray();
      res.send(result);
    });

    // favourite
    app.post("/favorites", async (req, res) => {
      const favorite = req.body;
      const findinarts = await arts.findOne({ _id: new ObjectId(favorite.artwordId) });

      const exists = await favouriteCollection.findOne({
        artwordId: favorite.artwordId,
        favorite: favorite.favorite,
      });

      if (exists) {
        return res.send({ message: "Already added" });
      }
      favorite.likes = findinarts.likes;
      const result = await favouriteCollection.insertOne(favorite);
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
      const id = req.params.id;
      const result = await arts.deleteOne({ _id: new ObjectId(id) });
      try {
        favouriteCollection.deleteOne({ artwordId: id });
      } catch {}
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
      if (!result) {
        res.send({ photoURL: "https://www.shutterstock.com/image-vector/delete-data-icon-document-folder-600nw-2380559695.jpg" });
      } else {
        res.send(result);
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server running");
});
