import { ColorModeContext, useMode } from "./theme"; // Importando o contexto e o hook de modo de cor personalizados
import { CssBaseline, ThemeProvider } from "@mui/material"; // Importando componentes do Material-UI
import Topbar from "./pages/global/topbar"; // Importando o componente Topbar personalizado
import Sidebar from "./pages/global/sidebar"; // Importando o componente Sidebar personalizado
import Team from "./pages/team"; // Importando o componente Team personalizado
import FormDevice from "./pages/formDevice"; // Importando o componente FormDevice personalizado
import FormTeam from "./pages/formTeam"; // Importando o componente FormTeam personalizado
import Devices from "./pages/devices"; // Importando o componente Devices personalizado
import Map from "./pages/map"; // Importando o componente Map personalizado
import UpdateTeam from "./pages/updateTeam"; // Importando o componente UpdateTeam personalizado
import UpdateDevice from "./pages/updateDevices"; // Importando o componente UpdateDevice personalizado
import { Routes, Route } from "react-router-dom"; // Importando componentes de roteamento do React Router

function App() {
  const [theme, colorMode] = useMode(); // Usando o hook useMode para obter o tema e o modo de cor

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar /> {/* Renderizando o componente Sidebar */}
          <main className="content">
            <Topbar /> {/* Renderizando o componente Topbar */}
            <Routes>
              <Route path="/team" element={<Team />} /> {/* Renderizando o componente Team na rota "/team" */}
              <Route path="/formDevice" element={<FormDevice />} /> {/* Renderizando o componente FormDevice na rota "/formDevice" */}
              <Route path="/formTeam" element={<FormTeam />} /> {/* Renderizando o componente FormTeam na rota "/formTeam" */}
              <Route path="/devices" element={<Devices />} /> {/* Renderizando o componente Devices na rota "/devices" */}
              <Route path="/" element={<Map />} /> {/* Renderizando o componente Map na rota principal "/" */}
              <Route path="/updateTeam/:id" element={<UpdateTeam />} /> {/* Renderizando o componente UpdateTeam na rota "/updateTeam/:id" */}
              <Route path="/updateDevice/:id" element={<UpdateDevice />} /> {/* Renderizando o componente UpdateDevice na rota "/updateDevice/:id" */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// Exportando função principal
export default App;
