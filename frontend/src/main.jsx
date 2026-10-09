import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router/dom";
import "./styles/index.css";
import LandingPage from "./features/landing/pages/LandingPage";
import Navbar from "./components/layout/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <RouterProvider router={router} />
    </div>
  </StrictMode>,
);
