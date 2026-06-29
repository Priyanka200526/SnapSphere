import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app.route'
import "../feature/shared/style/global.scss"
import { PostContextProvider } from '../feature/post/context/post.context'
import { NotificationProvider } from '../feature/notification/context/notification.context'
import { Toaster } from "react-hot-toast"

import { socket } from "../socket/socket"
import { useAuth } from '../feature/auth/hook/useAuth'
import { CommentProvider } from '../feature/comments/context/CommentContext'
import { StoryProvider } from '../feature/story/context/story.context'

const App = () => {

  const { user } = useAuth()

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id)
    }
  }, [user])

  return (
    <>
      <Toaster position="top-right" />

      <PostContextProvider>
        <NotificationProvider>
          <CommentProvider>
            <StoryProvider>
              <RouterProvider router={router} />
            </StoryProvider>
          </CommentProvider>
        </NotificationProvider>
      </PostContextProvider>
    </>
  )
}

export default App