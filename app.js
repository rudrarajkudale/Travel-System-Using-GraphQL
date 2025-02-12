const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const schema = require("./schema");
const bodyParser = require("body-parser");
const Booking = require("./models/booking");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // Ensure the correct views directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// GraphQL route
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// Home route
app.get("/", (req, res) => {
  res.redirect("/add-booking");
});

// Render add booking form
app.get("/add-booking", (req, res) => {
  res.render("addBooking", { message: null });
});

// Handle form submission
app.post("/add-booking", async (req, res) => {
  const { name, from, destination, date, time, price, transportMode } = req.body;
  try {
    const newBooking = new Booking({ name, from, destination, date, time, price, transportMode });
    await newBooking.save();
    
    res.render("addBooking", { message: "Your ticket has been successfully booked!" });
  } catch (error) {
    res.status(500).send("Error saving booking");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
