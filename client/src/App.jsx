import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Components/Layout";
import ErrorPage from "./Components/ErrorPage";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import WorkspaceDetails from "./Components/WorkspaceDetails";
import Profile from "./Pages/Components/Profile";
import Settings from "./Pages/Components/Settings";
import SheetDetails from "./Components/SheetDetails";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/register",
      element: <Register />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/home',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/home/profile",
          element: <Profile />,
        },
        {
          path: "/home/settings",
          element: <Settings />,
        },
        {
          path: "/home/:workspace",
          element: <WorkspaceDetails />,
        },
        {
          path: "/home/:workspace/:sheet",
          element: <WorkspaceDetails />,
        }
      ]
    },

  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
