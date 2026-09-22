import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage.jsx";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import CampusGuideModal from "./components/navigation/CampusGuideModal.jsx";
import { useChatStore } from "./store/chatStore.js";

export default function App() {
  const isMapOpen = useChatStore((s) => s.isMapOpen);
  const closeMap = useChatStore((s) => s.closeMap);
  const mapDestinationId = useChatStore((s) => s.mapDestinationId);

  return (
    <BrowserRouter>
      <Routes>
        {/* Main website: Protected so user must sign in first */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<Login />} />
        <Route path="/oauth/callback" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global GPREC Campus Guide & Navigation Modal */}
      <CampusGuideModal
        isOpen={isMapOpen}
        onClose={closeMap}
        initialDestinationId={mapDestinationId}
      />
    </BrowserRouter>
  );
}
