import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './addtocart.css';

const Addtocart = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem('userId'); // Get userId from local storage

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKENDURL}/cart/${userId}`)
      .then(response => setCartItems(response.data))
      .catch(error => console.error('Error fetching cart items:', error));
  }, [userId]);

  const handlePaymentSuccess = async (book) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKENDURL}/purchased`, { ...book, userId });

      await axios.delete(`${import.meta.env.VITE_BACKENDURL}/cart/${book._id}/${userId}`);

      alert(`${book.title} purchased successfully!`);
      setCartItems(cartItems.filter(item => item._id !== book._id));
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const removefromcart = async (book) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKENDURL}/cart/${book._id}/${userId}`);
      alert(`${book.title} removed from cart`);
      setCartItems(cartItems.filter(item => item._id !== book._id));
    } catch (error) {
      console.log(error);
    }
  };

  const buyNow = async (book) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAYKEY;
    if (!window.Razorpay) {
      console.error('Razorpay script not loaded');
      return;
    }
    if (!razorpayKey) {
      console.error('Razorpay API key not found');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKENDURL}/create-order`, {
        amount: book.price,
        currency: 'INR',
        book,
      });

      const { id, currency, amount, book: orderBook } = response.data;

      const options = {
        key: razorpayKey,
        amount: amount,
        currency: currency,
        name: 'BooksCentral',
        description: `Purchase ${orderBook.title}`,
        order_id: id,
        handler: async function (response) {
          try {
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              book: orderBook,
              userId, // Include userId
            };

            await axios.post(`${import.meta.env.VITE_BACKENDURL}/save-purchase`, paymentData);
            alert(`Payment successful and ${orderBook.title} saved!`);
          } catch (error) {
            console.error('Error saving purchased book:', error);
          }
        },
        prefill: {
          name: 'BookCentral',
          email: 'BookCentral@gmail.com',
          contact: '9541684889',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.coverImage} alt={item.title} />
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p>{item.author}</p>
                <p>₹{item.price}</p>
                <button
                  className="btn btn-success"
                  onClick={() => buyNow(item)}
                >
                  Buy Now
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => removefromcart(item)}
                >
                  Remove from Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addtocart;
