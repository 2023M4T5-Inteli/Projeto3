import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import { useEffect, useState } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../components/header";
import BarChart from "../../components/barChart";
import ProgressCircle from "../../components/progressCircle";
import InputBase from "@mui/material/InputBase";
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

const Map = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  
  const [historico, setHistorico] = useState([]);
  const url = "https://rd6rmm-3000.csb.app/hist/com-nome";

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => setHistorico(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Seja bem-vindo(a)!" />
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
             display="flex"
             backgroundColor={colors.primary[300]}
             borderRadius="3px"
            >
              <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Selecione o Dispositivo" />
              <IconButton type="button" sx={{ p: 1 }} justifyContent="flex-end">
                <ArrowDropDownOutlinedIcon />
              </IconButton>
              
            </Box>
          </Box>
          <Box>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Dispositivos em uso:
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              Em uso: 75%
            </Typography>
            <Typography
             variant="h5"
             color={colors.blueAccent[500]}
             sx={{ mt: "15px" }}>
                Disponíveis: 25%
              </Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 12"
          height={230}
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Histórico
            </Typography>
          </Box>
          {historico.map((info) => (
            <Box
              key={info.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {info.id_tablet}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {info.nome}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{info.data_hora}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {info.tipo_acesso}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Map;