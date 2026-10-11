import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LanguageSelection from "./features/client/pages/LanguageSelection";
import GetTicket from "./features/client/pages/GetTicket";
import OfficerDesktop from "./features/client/pages/OfficerDesktop";
import QueueDisplay from "./features/client/pages/QueueDisplay";
import "./styles/index.css";
import LandingPage from "./features/landing/pages/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/language-selection",
    element: <LanguageSelection />,
  },
  {
    path: "/services",
    element: <GetTicket />,
  },
  {
    path: "/officer",
    element: <OfficerDesktop />,
  },
  {
    path: "/display",
    element: <QueueDisplay />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
