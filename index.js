// import libraries/packages
const express = require("express");
const PORT = process.env.port || 5000;
const CORS = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.dbUser}:${process.env.dbPass}@cluster0.3lwmdbh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
// call middlewares
app.use(express.json());
app.use(CORS());

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
    const database = client.db("bd-master-developer");
    const technologyCollection = database.collection("technologies");
    const testimonialCollection = database.collection("testimonials");
    const articleCollection = database.collection("articles");
    const serviceCollection = database.collection("services");
    const memberCollection = database.collection("members");
    // Get APIs
    // Technologies Apis
    app.get("/technologies", async (req, res) => {
      const category = req.query.category;
      const query = { category: category };
      const result = await technologyCollection.find(query).toArray();
      res.json(result);
    });
    // Testimonials Apis
    app.get("/testimonials", async (req, res) => {
      const result = await testimonialCollection.find({}).toArray();
      res.json(result);
    });
    // Articles Apis
    app.get("/articles", async (req, res) => {
      const result = await articleCollection.find({}).toArray();
      res.json(result);
    });
    // Articles Apis (using category)
    app.get("/articles/:category", async (req, res) => {
      const category = req.params.category;
      console.log(category);
      const query = { category: category };
      const result = await articleCollection.find(query).toArray();
      res.json(result);
    });
    // Services Apis
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.json(result);
    });
    // Members Apis
    app.get("/members", async (req, res) => {
      const result = await memberCollection.find({}).toArray();
      res.json(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Welcome to BD Master Developer");
});

app.listen(PORT, () => {
  console.log("listening Port:", PORT);
});
