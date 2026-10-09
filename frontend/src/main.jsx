import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router/dom";
import "./styles/index.css";
import LandingPage from "./features/landing/pages/LandingPage";
import Navbar from "./components/layout/Navbar";
import ClientPage from "./features/client/pages/ClientPage";
import LoginPage from "./features/login/pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/client",
    element: <ClientPage />,
  },
  {path: "/login", element: <LoginPage />},
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <RouterProvider router={router} />
    </div>
  </StrictMode>,
);
