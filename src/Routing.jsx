import React from 'react'
import { RouterProvider,Router,Route, Routes } from 'react-router-dom'
import Landing from '../../../../AMAZONCLONE/amazon-clone/amazon-clone/src/Pages/Landing/Landing'
import Auth from '../../../../AMAZONCLONE/amazon-clone/amazon-clone/src/Pages/Auth/Auth'
import Payment from '../../../../AMAZONCLONE/amazon-clone/amazon-clone/src/Pages/Payment/Payment'
import Orders from '../../../../AMAZONCLONE/amazon-clone/amazon-clone/src/Pages/Orders/Orders'
import Cart from '../../../../AMAZONCLONE/amazon-clone/amazon-clone/src/Pages/Cart/Cart'
import Results from '../../../../AMAZONCLONE/amazon-clone/amazon-clone/src/Pages/Results/Results'
import ProductDetail from '../../../../AMAZONCLONE/amazon-clone/amazon-clone/src/Pages/ProductDetail/ProductDetail'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from '../../../../AMAZONCLONE/amazon-clone/amazon-clone/src/Components/ProtectedRoute/ProtectedRoute'
const stripePromise = loadStripe(
  "pk_test_51QQYhpFNA8M7N472uHMu4MugpJP3J8pKeGL7qLUeZMaMElo3mKweKfmeAbgyjOHYM52LtPP42ggAxQNHSrUjLur100rz3wyKCz"
);

function Routing() {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute
              msg={"You must login before you pay"}
              redirect={"/payment"}
            >
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute
              msg={"You must login to see your orders"}
              redirect={"/orders"}
            >
              
                <Orders />
              
            </ProtectedRoute>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category/:categoryName" element={<Results />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
      </Routes>
    );
}

export default Routing