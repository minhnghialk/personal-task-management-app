import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toast = () => (
  <ToastContainer position="top-center" autoClose={2000} />
);
