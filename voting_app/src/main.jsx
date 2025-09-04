import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider }from "react-redux"
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ErrorPage from "./pages/ErrorPage.jsx"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Result from "../src/pages/Result.jsx"
import Elections from "./pages/Elections"
import ElectionDetail from "./pages/ElectionDetail"
import Candidates from "./pages/Candidates"
import Congrates from "./pages/Congrates"
import Logout from "./pages/Logout"
import BlogList from "./pages/BlogList"
import BlogDetail from "./pages/BlogDetail"
import CreateBlog from "./pages/CreateBlog"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import store from './store/store.js'


const router  = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
    {
      index: true,
      element: <BlogList/>
    },
    {
      path: 'login',
      element: <Login/>
    },
    {
      path: 'register',
      element: <Register/>
    },
    {
      path: 'results',
      element: <ProtectedRoute><Result/></ProtectedRoute>
    },
    {
      path: 'elections',
      element: <ProtectedRoute><Elections/></ProtectedRoute>
    },
    {
      path: 'elections/:id',
      element: <ProtectedRoute><ElectionDetail/></ProtectedRoute>
    },
    {
      path: 'elections/:id/candidates',
      element: <ProtectedRoute><Candidates/></ProtectedRoute>
    },
    {
      path: 'congrates',
      element: <ProtectedRoute><Congrates/></ProtectedRoute>
    },
    {
      path: 'logout',
      element: <Logout/>
    },
    // Blog routes
    {
      path: 'blogs',
      element: <BlogList/>
    },
    {
      path: 'blogs/create',
      element: <AdminRoute><CreateBlog/></AdminRoute>
    },
    {
      path: 'blogs/:id',
      element: <BlogDetail/>
    },

    ]
  }
])

createRoot(document.getElementById('root')).render(


    <Provider store={store}>
    <RouterProvider router={router}>
    </RouterProvider>
    </Provider>
 
)
