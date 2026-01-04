import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './components/landingPage.jsx';
import Products from './components/products.jsx';
import Profile from './components/Profile.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import Layout from './layout.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'product', element: <Products /> },
      { path: 'profile', element: <Profile /> },
      { path: 'admin/login', element: <AdminLogin /> },
      { path: 'admin', element: <AdminPanel /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
