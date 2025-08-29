import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/layout";
// import Dashboard from "@/pages/dashboard";
const Dashboard = React.lazy(() => import("@/pages/dashboard"));
import CAInter from "@/pages/cainter";
import CAFinal from "@/pages/cafinal";
import Debug from "@/pages/debug";
import Settings from "@/pages/settings";
import Trash from "@/pages/trash";
import { ThemeProvider } from "./components/theme/theme-provider";
import TopicPage from "./pages/topic";
import { ConfirmDialogProvider } from "./components/modals/global-confirm-dialog";
import NewlyAdded from "./pages/newly-added";
import Login from "./pages/login";
import { AuthProvider } from "./context/auth-context";
import VideoNotes from "./pages/video-notes";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <ConfirmDialogProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />

              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/newlyadded" element={<NewlyAdded />} />
                <Route path="/CAInter" element={<CAInter />} />
                <Route path="/CAFinal" element={<CAFinal />} />
                <Route path="/CAInter/:topicId" element={<TopicPage />} />
                <Route path="/CAFinal/:topicId" element={<TopicPage />} />
                <Route path="/Video/:course/:type" element={<VideoNotes />} />
                <Route path="/Debug" element={<Debug />} />
                <Route path="/Settings" element={<Settings />} />
                <Route path="/Trash" element={<Trash />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ConfirmDialogProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
