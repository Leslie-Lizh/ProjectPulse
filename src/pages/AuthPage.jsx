import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import { Routes, Route, Navigate } from "react-router-dom";

export default function AuthPage({ setUser }) {
    return (
      <>
        <Routes>
          <Route path="/" element={<LoginForm setUser={setUser} />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </>
    );
  }