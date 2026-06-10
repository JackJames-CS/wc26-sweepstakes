import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { Groups } from "./pages/Groups";
import { History } from "./pages/History";
import { Teams } from "./pages/Teams";
import { TeamDetail } from "./pages/TeamDetail";
import { DataProvider } from "./context/DataContext";
import { ParticipantProvider } from "./context/ParticipantContext";

export default function App() {
  return (
    <DataProvider>
      <ParticipantProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Overview />} />
              <Route path="groups" element={<Groups />} />
              <Route path="history" element={<History />} />
              <Route path="teams" element={<Teams />} />
              <Route path="teams/:name" element={<TeamDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </ParticipantProvider>
    </DataProvider>
  );
}
