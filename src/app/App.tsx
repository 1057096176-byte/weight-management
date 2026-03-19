import "./utils/reactWarningPatch"; // Must be first - patches React warnings
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return <RouterProvider router={router} />;
}