import { RequestHandler } from "express";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51K8U3bA8Wu6mzkGu5nh3VeyKBXsYzcknntMgfOne75UuPdvl2zincfWrFBxkOjQRwBZIjlODiNqrgLaGebi5DlCa00Ec2lfcDt",
  {
    apiVersion: "2023-08-16", // Use the appropriate API version
  }
);

export const pay: RequestHandler = async (req, res) => {
  const { payment } = req.body;
  console.log("stripe payload", payment);
  const session = await stripe.checkout.sessions.create({
    //   line_items,
    line_items: [
      {
        price_data: {
          currency: payment?.currency,
          product_data: {
            name: "Shipping Fee",
            metadata: {
              totalRate: payment?.rate, // Add Total Rate to metadata
              insurance: payment?.insurance, // Add Insurance to metadata
              otherPrice: payment?.other_amount, // Add Other Price to metadata
              date: payment?.date, // Add Date to metadata
            },
          },
          unit_amount:
            payment?.rate * 100 +
            payment?.insurance * 100 +
            payment?.other_amount * 100, // Add Total Rate + Insurance + Other Price
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5173/stripe/payment/success`,
    cancel_url: `http://localhost:5173/create/basic`,
  });

  res.send({ url: session.url });
};
