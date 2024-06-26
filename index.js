const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqpfzla.mongodb.net/?retryWrites=true&w=majority`;

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
    const courseCollection = client.db("educationCare").collection("course");
    const myCourseCollection = client
      .db("educationCare")
      .collection("myCourse");

    // read
    app.get("/course", async (req, res) => {
      const course = courseCollection.find();
      const result = await course.toArray();
      res.send(result);
    });
    app.get("/course/:id", async (req, res) => {
      const id = req.params.id;
      const details = { _id: new ObjectId(id) };
      const result = await courseCollection.findOne(details);
      res.send(result);
    });

    // create
    app.post("/myCourse", async (req, res) => {
      const course = req.body;
      console.log(course);
      const query = { id: course._id }; // Access _id property properly
      console.log("new id", query);
      
      try {
          const existingUser = await myCourseCollection.findOne(query);
          if (existingUser) {
              return res.send({ message: 'User already added this course.', insertedId: null });
          }
          
          const result = await myCourseCollection.insertOne(course);
          console.log("Course added successfully:", result);
          res.send(result);
      } catch (error) {
          console.error("Error adding course:", error);
          res.status(500).send({ message: 'User already enroll this course..', error: error });
      }
  });
    app.get('/myCourse',async(req,res) =>{
      const course = myCourseCollection.find();
      const result =await course.toArray()
      res.send(result);
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Education care is running");
});

app.listen(port, () => {
  console.log(`Education care is running on port: ${port}`);
});
