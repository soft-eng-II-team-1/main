import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LanguageSelection from "./components/LanguageSelection";
import GetTicket from "./components/GetTicket"; // The next page
import OfficerDesktop from "./components/OfficerDesktop";
import QueueDisplay from "./components/QueueDisplay"; // The next page
import "./styles/index.css";

const router = createBrowserRouter([
  {
    path: "/",
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
