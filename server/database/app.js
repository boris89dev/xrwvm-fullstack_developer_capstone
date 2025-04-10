const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/dealershipsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Reviews = require('./review');
const Dealerships = require('./dealership');

(async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data.reviews);
    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data.dealerships);

  } catch (error) {
    console.error('Error initializing database:', error);
  }
})();

app.get('/', async (req, res) => {
  res.send("Welcome to the Mongoose API");
});

app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find();
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealers = await Dealerships.find({ state: req.params.state });
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealerships.findOne({ id: req.params.id });
    res.json(dealer);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealership' });
  }
});

app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;
    const lastReview = await Reviews.findOne().sort({ id: -1 });
    const new_id = lastReview ? lastReview.id + 1 : 1;

    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    res.status(500).json({ error: 'Error inserting review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
