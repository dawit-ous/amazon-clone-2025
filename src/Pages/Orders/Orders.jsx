import React, { useContext, useEffect, useState } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import classes from "./Orders.module.css";
import { db } from "../../Utility/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import ProductCard from "../../Components/Product/ProductCard";

function Orders() {
  const [{ user }] = useContext(DataContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      // Reference the orders collection under the correct path
      const userOrdersRef = collection(db, "users", user.uid, "orders"); // Correct path

      // Create a query to order by the "created" field in descending order
      const q = query(userOrdersRef, orderBy("created", "desc"));

      // Listen to the query snapshot
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log(snapshot);
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      // Cleanup Firestore listener on component unmount
      return () => unsubscribe();
    } else {
      setOrders([]); // Clear orders if no user
    }
  }, [user]); // Add 'user' as a dependency if it changes

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.orders_container}>
          <h2>Your orders</h2>
          {/* Message if there are no orders */}
          {orders?.length === 0 && (
            <div style={{ padding: "20px" }}>You don't have orders yet.</div>
          )}

          {/* Display each order */}
          {orders?.map((eachOrder, i) => (
            <div key={i}>
              <hr />
              <p>Order ID: {eachOrder?.id}</p>
              {eachOrder?.data?.basket?.map((order) => (
                <ProductCard flex={true} product={order} key={order.id} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </LayOut>
  );
}

export default Orders;
