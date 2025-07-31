// import libraries/packages
const express = require("express");
const PORT = process.env.port || 5000;
const CORS = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const blogCollection = database.collection("blogs");
    const serviceCollection = database.collection("services");
    const memberCollection = database.collection("members");
    const contactInfoCollection = database.collection("contactInfo");
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
    // blogs Apis
    app.get("/blogs", async (req, res) => {
      const options = {
        projection: { title: 1, image: 1, tag: 1, description: 1, slug: 1 },
      };
      const result = await blogCollection.find({}, options).toArray();
      res.json(result);
    });
    // get blogs (using category)
    app.get("/blogs/:category", async (req, res) => {
      const category = req.params.category;

      const query = { category: category };
      const options = {
        projection: { title: 1, image: 1, tag: 1, description: 1, slug: 1 },
      };
      const result = await blogCollection.find(query, options).toArray();
      res.json(result);
    });
    // get blog details (using slug)
    app.get("/blog-details/:slug", async (req, res) => {
      const slug = req.params.slug;
      const query = { slug: slug };

      const result = await blogCollection.findOne(query);
      res.json(result);
    });
    // get latest blogs
    app.get("/latest-blogs", async (req, res) => {
      const blogStatus = req.query.status;
      const currentBlogId = req.query.id;
      const query = {
        status: blogStatus,
        _id: { $ne: new ObjectId(currentBlogId) },
      };
      const options = {
        projection: { title: 1, image: 1, status: 1, slug: 1 },
        sort: { publish_date: -1 },
      };
      const result = await blogCollection.find(query, options).toArray();
      res.json(result);
    });
    // Services Apis
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.json(result);
    });
    // Members Apis
    app.get("/members", async (req, res) => {
      const options = {
        sort: { role: -1, title: 1 },
      };
      const result = await memberCollection.find({}, options).toArray();
      res.json(result);
    });

    // POST APIs
    // contact form data
    app.post("/contact", async (req, res) => {
      const contactInfo = req.body;
      const result = await contactInfoCollection.insertOne(contactInfo);
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
