import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupRoute from "@/routes/auth/signup.route";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/signup" element={<SignupRoute />} />
        <Route path="/" element={<Navigate to="/auth/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
