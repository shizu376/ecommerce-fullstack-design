import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./api/setupAxios";
import App from "./App";
import { CartProvider } from "./context/CartContext"; 
import { WishlistProvider } from "./context/WishlistContext";
import { SnackbarProvider } from "./context/SnackbarContext";
import "./index.css"; 


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider>
        <CartProvider>
          <WishlistProvider>
           
            <App />
          </WishlistProvider>
        </CartProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
