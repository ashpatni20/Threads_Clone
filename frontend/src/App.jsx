
import './App.css'
import Home from './components/Home';
import HomePostForYou from './components/HomePostForYou';
import Login from './components/Login'
import PostNewModel from './components/PostNewModel';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup/>,
    },
    {
      path : "/",
      element : (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
      children: [
      {
        path: "profile/:id",
        element: <Profile />,
      },
      {
        path: "home",
        element: <HomePostForYou />, // Default child route for "/home"
      }
    ]
    },
  ]);
  return (
    <>
    <RouterProvider router={appRouter} />
    </>
  )
}

export default App
