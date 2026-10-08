import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router/dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Landing</div>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
