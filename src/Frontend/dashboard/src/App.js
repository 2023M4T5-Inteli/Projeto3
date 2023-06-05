import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./pages/global/topbar";
import Sidebar from "./pages/global/sidebar";
import Dashboard from "./pages/geral";
import Team from "./pages/team";
import Form from "./pages/form";
import Devices from "./pages/devices";
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
              <Route path = "/" element={<Dashboard />} />
              <Route path = "/team" element={<Team />} />
              <Route path = "/form" element={<Form />} />
              <Route path = "/devices" element={<Devices />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App;
