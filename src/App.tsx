// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout";

// Page placeholders
function Dashboard() {
  return <div className="bg-gray-100 p-4 text-xl font-bold">Dashboard Page</div>;
}

function Questions() {
  return <div className="text-xl font-bold">Questions Page</div>;
}

function Quizzes() {
  return <div className="text-xl font-bold">Quizzes Page</div>;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen min-w-screen bg-gray-100">
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/quizzes" element={<Quizzes />} />
          </Routes>
        </MainLayout>
      </div>
    </BrowserRouter>
  );
}

export default App;
