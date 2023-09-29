
import { RequestHandler } from "express";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51K8U3bA8Wu6mzkGu5nh3VeyKBXsYzcknntMgfOne75UuPdvl2zincfWrFBxkOjQRwBZIjlODiNqrgLaGebi5DlCa00Ec2lfcDt",
  {
    apiVersion: "2023-08-16", // Use the appropriate API version
  }
);

export const pay: RequestHandler = async (req, res) => {
    // const line_items = req.body.cartItems?.map((item:any)=>{
    //   return {
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: item?.productInfo?.productName,
    //         metadata:{
    //           productId:item?.productInfo?._id
    //         }
    //       },
    //       unit_amount: (item?.productInfo?.basePrice),
    //     },
    //     quantity: 1,
    //   }
    // });
    const session = await stripe.checkout.sessions.create({
    //   line_items,
    line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/payment/success`,
      cancel_url: `http://localhost:5173/create/basic`,
    });
  
    res.send({url:session.url});
  };