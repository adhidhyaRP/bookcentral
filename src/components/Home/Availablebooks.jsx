import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css';

const AvailableBooks = () => {
  const [books, setBooks] = useState([]);
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKENDURL}/books`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const addToCart = async (book) => {
    if (!userId) {
      alert("Please log in to add items to the cart.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKENDURL}/cart/${userId}`, book);
      console.log(`Added to cart: ${response.data.title}`);
      alert(`${response.data.title} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const buyNow = async (book) => {
    if (!userId) {
      alert("Please log in to purchase books.");
      return;
    }

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
            };

            await axios.post(`${import.meta.env.VITE_BACKENDURL}/save-purchase/${userId}`, paymentData);
            alert(`Payment successful and ${orderBook.title} saved!`);
          } catch (error) {
            console.error('Error saving purchased book:', error);
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9999999999',
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
    <div className="book-list">
      {books.map(book => (
        <div key={book._id} className="book-item">
          <img src={book.coverImage} alt={book.title} />
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.description}</p>
          <p className='bookprice'>₹{book.price}</p>
          <div className="button-group">
            <button 
              className="btn btn-primary"
              onClick={() => addToCart(book)}
            >
              Add to Cart
            </button>
            <button 
              className="btn btn-success"
              onClick={() => buyNow(book)}
            >
              Buy Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailableBooks;
