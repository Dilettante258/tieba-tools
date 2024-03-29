import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";

import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import {NextUIProvider} from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from "next-themes";
import App from "./App";
import Home from "./pages/Home.tsx";
import Error from "./pages/Error.tsx";
import UserPost, {searchPostAction, UPLoader} from "./pages/UserPost.tsx";
import NavigationHeader from "./components/NavigationHeader.tsx";
import About from "./pages/About.tsx";
import UserPostContent, {UPCLoader} from "./pages/secondary/UserPostContent.tsx";
import Config from "./pages/Config.tsx";
import Friends from "./pages/Friends.tsx";
import FriendsContent, {FriendsLoader, searchFriendsAction} from "./pages/secondary/FriendsContent.tsx";
import Follows, {searchFollowsAction, UnLoader} from "./pages/Follows.tsx";
import FollowsContent, {FollowsLoader} from "./pages/secondary/FollowsContent.tsx";
import Fans, {searchFansAction} from "./pages/Fans.tsx";
import FansContent, {FansLoader} from "./pages/secondary/FansContent.tsx";
import Archive from "./pages/Archive.tsx";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/userpost",
        element: <UserPost />,
        loader: UPLoader,
        action: searchPostAction,
        children: [
          {
            path: "/userpost/:un/:page",
            element: <UserPostContent />,
            loader: UPCLoader,
            action: searchPostAction,
          },
        ],
      },
      {
        path: "/follows",
        element: <Follows />,
        loader: UnLoader,
        action: searchFollowsAction,
        children: [
          {
            path: "/follows/:un",
            element: <FollowsContent />,
            loader: FollowsLoader,
            action: searchFollowsAction,
          },
        ],
      },
      {
        path: "/fans",
        element: <Fans />,
        loader: UnLoader,
        action: searchFansAction,
        children: [
          {
            path: "/fans/:un",
            element: <FansContent />,
            loader: FansLoader,
            action: searchFansAction,
          },
        ],
      },
      {
        path: "/friends",
        element: <Friends />,
        loader: UnLoader,
        action: searchFriendsAction,
        children: [
          {
            path: "/friends/:un",
            element: <FriendsContent />,
            loader: FriendsLoader,
            action: searchFriendsAction,
          },
        ],
      },
      {
        path: "/Archive",
        element: <Archive />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/config",
        element: <Config />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")  as HTMLElement).render(
  <React.StrictMode>
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <NavigationHeader />
        <RouterProvider router={router} />
      </NextThemesProvider>
    </NextUIProvider>
  </React.StrictMode>
);
