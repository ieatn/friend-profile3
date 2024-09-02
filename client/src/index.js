import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx';
import Profile from './Profile.jsx';
import Form from './Form.jsx';
import Login from './Login.jsx';
import ProfileDetail from './ProfileDetail.jsx'; // Import your dynamic route component
import { Auth0Provider } from "@auth0/auth0-react";
import { domain, clientId } from "./api/Config";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/form/:id?", // Dynamic route with optional `id` parameter
    element: <Form />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/:id", // Dynamic route for profile details
    element: <ProfileDetail />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);
