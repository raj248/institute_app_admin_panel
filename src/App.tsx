import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard";
import CAInter from "@/pages/cainter";
import CAFinal from "@/pages/cafinal";
import Debug from "@/pages/debug";
import Settings from "@/pages/settings";
import Trash from "@/pages/trash";
import { ThemeProvider } from "./components/theme/theme-provider";
import TopicPage from "./pages/topic";
import TestPaperPage from "./pages/testpaper";
import { ConfirmDialogProvider } from "./components/modals/global-confirm-dialog";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ConfirmDialogProvider>
        <BrowserRouter>
          <Routes>
            {/* Layout Route */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/CAInter" element={<CAInter />} />
              <Route path="/CAFinal" element={<CAFinal />} />
              <Route path="/CAInter/:topicId" element={<TopicPage />} />
              <Route path="/CAFinal/:topicId" element={<TopicPage />} />
              <Route path="/CAInter/:topicId/testpaper/:testPaperId" element={<TestPaperPage />} />
              <Route path="/CAFinal/:topicId/testpaper/:testPaperId" element={<TestPaperPage />} />
              <Route path="/Debug" element={<Debug />} />
              <Route path="/Settings" element={<Settings />} />
              <Route path="/Trash" element={<Trash />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfirmDialogProvider>
    </ThemeProvider>
  );
}

export default App;
