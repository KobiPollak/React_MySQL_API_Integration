import logo from "./logo.svg";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  redirect as Redirect,
  Navigate,
} from "react-router-dom";
import React, { useEffect } from "react";

import NotFound from "./components/notfound";
import Login from "./components/login";
import Logup from "./components/register";
import Application from "./components/application";
import Info from "./components/info";
import Todos from "./components/todos";
import Posts from "./components/posts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Logup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/application/:id" element={<Application />}>
          <Route index path="/application/:id/info" element={<Info />} />
          <Route path="/application/:id/todos" element={<Todos />} />
          <Route path="/application/:id/posts" element={<Posts />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
