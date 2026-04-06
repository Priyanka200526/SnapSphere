import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app.route'
import { AuthProvider } from './feature/auth/context/auth.context'
import "./feature/shared/style/global.scss"
import { PostContextProvider } from './feature/post/context/post.context'
import { Toaster } from "react-hot-toast";

const App = () => (
  <>
    <Toaster />
    <AuthProvider>
      <PostContextProvider>
        <RouterProvider router={router} />
      </PostContextProvider>
    </AuthProvider>

  </>

)

export default App
