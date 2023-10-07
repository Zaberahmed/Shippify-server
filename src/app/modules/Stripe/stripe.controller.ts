import axios from "axios";
import { Request, RequestHandler, Response } from "express";
import Stripe from "stripe";
import { upcomingPayment } from "../../services/service.bnpl";

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
            parseFloat((payment?.rate * 100 +
              payment?.insurance * 100 +
              payment?.other_amount * 100).toFixed(2)), // Add Total Rate + Insurance + Other Price
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


export const bnplPaymentController = async (req: Request | any, res: Response) => {
  try {
    const user_id = req.authUser;
    const upcomingPaymentList =   await upcomingPayment({ user_id: user_id });
    // console.log("=================upcomingPaymentList=======================");
    // console.log(upcomingPaymentList)
    
    return res.status(200).json({
      status: "success",
      data: upcomingPaymentList,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};