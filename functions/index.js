const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Initialize Stripe with the secret key from .env
const stripe = require("stripe")(process.env.STRIPE_KEY);

// Initialize Express
const app = express();
app.use(cors({ origin: true })); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Route for basic health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success",
  });
});

// Route for creating payment intent
app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total); // Amount in cents (e.g., 5000 = $50)

  // Validate the total value
  if (isNaN(total) || total <= 0) {
    return res.status(403).json({
      message: "Total must be a number greater than 0",
    });
  }

  try {
    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd", // Currency is USD
    });

    // Respond with the Client Secret for Stripe
    logger.log("Payment Intent Created:", paymentIntent);
    res.status(201).json({
      ClientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    // Catch Stripe errors and send a response
    logger.error("Stripe Error:", error.message);
    res.status(500).json({
      message: "Payment failed",
      error: error.message,
    });
  }
});

// Export the app as a Firebase function
exports.api = onRequest(app);
