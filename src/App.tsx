import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview";
import { Groups } from "./pages/Groups";
import { Bracket } from "./pages/Bracket";
import { History } from "./pages/History";
import { Stats } from "./pages/Stats";
import { Teams } from "./pages/Teams";
import { TeamDetail } from "./pages/TeamDetail";
import { PlayerDetail } from "./pages/PlayerDetail";
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
              <Route path="bracket" element={<Bracket />} />
              <Route path="history" element={<History />} />
              <Route path="stats" element={<Stats />} />
              <Route path="teams" element={<Teams />} />
              <Route path="teams/:name" element={<TeamDetail />} />
              <Route path="teams/:name/players/:pid" element={<PlayerDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </ParticipantProvider>
    </DataProvider>
  );
}
