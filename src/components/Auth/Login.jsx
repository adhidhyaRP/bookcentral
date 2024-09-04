import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './auth.css'; 
import Axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  // const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      Axios.post(`${import.meta.env.VITE_BACKENDURL}/auth/login`, values)
        .then((response) => {
          if (response.data.status) {
            localStorage.setItem('authorized',true)
            localStorage.setItem('userId',response.data.userId)
            navigate('/');
          }
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <div className="login-container">
      <form onSubmit={formik.handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email} 
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password}</div>
          )}
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <Link to="/forgotpassword">Forgot password</Link>
        <Link to="/register" style={{ float: 'right' }}>
          Create an account
        </Link>
      </form>
    </div>
  );
};

export default Login;
