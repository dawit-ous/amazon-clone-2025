import React from 'react'
import { RouterProvider,Router,Route, Routes } from 'react-router-dom'
import Landing from '../src/Pages/Landing/Landing'
import Results from "../src/Pages/Results/Results";
import Cart from "../src/Pages/Cart/Cart";
import ProductDetail from "../src/Pages/ProductDetail/ProductDetail";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from '../src/Components/ProtectedRoute/ProtectedRoute'
import Auth from './Pages/Auth/Auth';
import Payment from './Pages/Payment/Payment';
import Orders from './Pages/Orders/Orders';
const stripePromise = loadStripe(
  "pk_test_51QQYhpFNA8M7N472uHMu4MugpJP3J8pKeGL7qLUeZMaMElo3mKweKfmeAbgyjOHYM52LtPP42ggAxQNHSrUjLur100rz3wyKCz"
);

function Routing() {
    return (
      <Routes>
        <Route path="/" element={<Landing/>} />
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