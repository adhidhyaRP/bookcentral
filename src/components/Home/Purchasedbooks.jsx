import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css';

const PurchasedBooks = () => {
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const userId = localStorage.getItem('userId'); // Get userId from local storage

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKENDURL}/purchased/${userId}`);
        setPurchasedBooks(response.data);
      } catch (error) {
        console.error('Error fetching purchased books:', error);
      }
    };

    fetchPurchasedBooks();
  }, [userId]);

  return (
    <div className="purchased-container">
      <h2>Purchased Books</h2>
      {purchasedBooks.length === 0 ? (
        <p>No books purchased yet.</p>
      ) : (
        <div className="purchased-list">
          {purchasedBooks.map(book => (
            <div key={book._id} className="purchased-item">
              <img src={book.coverImage} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              
             
              <p>₹{book.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchasedBooks;
