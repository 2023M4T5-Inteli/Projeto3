import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./pages/global/topbar";
import Sidebar from "./pages/global/sidebar";
import Team from "./pages/team";
import FormDevice from "./pages/formDevice";
import FormTeam from "./pages/formTeam";
import Devices from "./pages/devices";
import Map from "./pages/map";
import { Routes, Route } from "react-router-dom";


function App() {
  const [theme, colorMode] = useMode()

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path = "/team" element={<Team />} />
              <Route path = "/formDevice" element={<FormDevice />} />
              <Route path = "/formTeam" element={<FormTeam />} />
              <Route path = "/devices" element={<Devices />} />
              <Route path = "/" element={<Map />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App;
