import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  FutLeaguePage,
  BsbLeaguePage,
  BskLeaguePage,
  HkyLeaguePage,
  RgyLeaguePage,
  CrcLeaguePage,
  AmfLeaguePage,
} from "./Pages/LeaguesPages/LeaguesPage";
import {
  FutTeamPage,
  BsbTeamPage,
  BskTeamPage,
  HkyTeamPage,
  RgyTeamPage,
  CrcTeamPage,
  AmfTeamPage,
} from "./Pages/TeamsPages/TeamsPage";
import {
  FutPlayerPage,
  BskPlayerPage,
  BsbPlayerPage,
  AmfPlayerPage,
  CrcPlayerPage,
  HkyPlayerPage,
} from "./Pages/PlayerPages/PlayersPage";
import {
  FutFixturePage,
  BskFixturePage,
  BsbFixturePage,
  CrcFixturePage,
  RgyFixturePage,
  AmfFixturePage,
  HkyFixturePage,
} from "./Pages/FixturePages/FixturesPage";
import {
  FutHomePage,
  BsbHomePage,
  BskHomePage,
  RgyHomePage,
  HkyHomePage,
  CrcHomePage,
  AmfHomePage,
} from "./Pages/HomePages/HomePages";
import DataProvider from "./Helpers/DataContext";
import SideBar from "./Components/SideBar/SideBar";
import NavBar from "./Components/NavBar/NavBar";

function App() {
  return (
    <div className="main-container">
      <DataProvider>
        <SideBar />
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/football" element={<FutHomePage />} />
            <Route path="/football/fixture/:id" element={<FutFixturePage />} />
            <Route path="/football/league/:id" element={<FutLeaguePage />} />
            <Route path="/football/team/:id" element={<FutTeamPage />} />
            <Route path="/football/player/:id" element={<FutPlayerPage />} />
            <Route path="/basketball" element={<BskHomePage />} />
            <Route path="/basketball/league/:id" element={<BskLeaguePage />} />
            <Route path="/basketball/team/:id" element={<BskTeamPage />} />
            <Route
              path="/basketball/fixture/:id"
              element={<BskFixturePage />}
            />
            <Route path="/basketball/player/:id" element={<BskPlayerPage />} />
            <Route path="/baseball" element={<BsbHomePage />} />
            <Route path="/baseball/league/:id" element={<BsbLeaguePage />} />
            <Route path="/baseball/fixture/:id" element={<BsbFixturePage />} />
            <Route path="/baseball/team/:id" element={<BsbTeamPage />} />
            <Route path="/baseball/player/:id" element={<BsbPlayerPage />} />
            <Route path="/hockey" element={<HkyHomePage />} />
            <Route path="/hockey/league/:id" element={<HkyLeaguePage />} />
            <Route path="/hockey/team/:id" element={<HkyTeamPage />} />
            <Route path="/hockey/fixture/:id" element={<HkyFixturePage />} />
            <Route path="/hockey/player/:id" element={<HkyPlayerPage />} />
            <Route path="/rugby" element={<RgyHomePage />} />
            <Route path="/rugby/league/:id" element={<RgyLeaguePage />} />
            <Route path="/rugby/team/:id" element={<RgyTeamPage />} />
            <Route path="/rugby/fixture/:id" element={<RgyFixturePage />} />
            <Route path="/cricket" element={<CrcHomePage />} />
            <Route path="/cricket/league/:id" element={<CrcLeaguePage />} />
            <Route path="/cricket/team/:id" element={<CrcTeamPage />} />
            <Route path="/cricket/player/:id" element={<CrcPlayerPage />} />
            <Route path="/cricket/fixture/:id" element={<CrcFixturePage />} />
            <Route path="/american-football" element={<AmfHomePage />} />
            <Route
              path="/american-football/league/:id"
              element={<AmfLeaguePage />}
            />
            <Route
              path="/american-football/team/:id"
              element={<AmfTeamPage />}
            />
            <Route
              path="/american-football/fixture/:id"
              element={<AmfFixturePage />}
            />
            <Route
              path="/american-football/player/:id"
              element={<AmfPlayerPage />}
            />
            <Route path="/" element={<Navigate to={"/football"} replace />} />
          </Routes>
        </div>
      </DataProvider>
    </div>
  );
}

export default App;
