import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Components/Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // Calculate total price
  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);

  // Calculate total number of items
  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  // Handle card input change
  const handleChange = (e) => {
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      setProcessing(true);

      // Step 1: Create Payment Intent from backend
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`,
      });
      const clientSecret = response.data?.ClientSecret;
      console.log("Client Secret:", clientSecret);

      // Step 2: Confirm payment with Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        console.error("Payment confirmation failed:", error.message);
        setProcessing(false);
        return;
      }

      console.log("Payment Intent:", paymentIntent);
      console.log("Payment Intent ID:", paymentIntent?.id);

      // Step 3: Save the order to Firestore
      if (!user || !user.uid) {
        console.error("User is not authenticated or UID is missing.");
        setProcessing(false);
        return;
      }

      const orderData = {
        basket: basket, // the items purchased
        amount: paymentIntent.amount, // the amount charged
        created: paymentIntent.created, // timestamp of payment
      };

      // Write to Firestore
      try {
        await setDoc(
          doc(collection(db, "users", user.uid, "orders"), paymentIntent.id),
          orderData
        );
        console.log("Order successfully written to Firestore");
      } catch (error) {
        console.error("Error writing order to Firestore:", error.message);
      }

      // Step 4: Clear the basket
      dispatch({
        type: Type.EMPTY_BASKET,
      });

      setProcessing(false);
      navigate("/orders", { state: { msg: "You have placed a new order!" } });
    } catch (error) {
      console.log(error);
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      {/* Header */}
      <div className={classes.payment_header}>Checkout ({totalItem}) items</div>

      {/* Payment Section */}
      <section className={classes.payment}>
        {/* Delivery Address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>Matthew</div>
            <div>Alexandria</div>
          </div>
        </div>
        <hr />

        {/* Product Review */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div className={classes.product_list}>
            {basket?.map((item, i) => (
              <ProductCard product={item} flex={true} key={i} />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment Method */}
        <div className={classes.flex}>
          <h3>Payment method</h3>
          <div className={classes.payment_card_container}>
            <div className={classes.payment_details}>
              <form action="" onSubmit={handlePayment}>
                {/* Error Message */}
                {cardError && (
                  <small style={{ color: "red" }}>{cardError}</small>
                )}

                {/* Card Element */}
                <CardElement onChange={handleChange} />

                {/* Price */}
                <div className={classes.payment_price}>
                  <div>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <p>Total order</p> | <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit">
                    {processing ? (
                      <div className={classes.loading}>
                        <ClipLoader color="gray" size={12} />
                        <p>Processing...</p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment;
