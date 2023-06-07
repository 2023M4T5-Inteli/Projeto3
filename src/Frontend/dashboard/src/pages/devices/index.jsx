import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {useNavigate} from 'react-router-dom';
import { tokens } from "../../theme";
import { mockDataDevices } from "../../data/mockData";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const Devices = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigateForm = () => {
    navigate('/formDevice');
  };
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Setor",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "phone",
      headerName: "MAC Dispositivo",
      flex: 1,
    },
    {
      field: "zipCode",
      headerName: "MAC Rastreador",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Box height="50px" display="flex" justifyContent="space-between" alignItems="center">
      <Header
        title="Dispositivos"
        subtitle="Lista de dispositivos cadastrados"
      />
      <Box>
      <Button onClick={navigateForm}
        sx={{
          backgroundColor: colors.blueAccent[700],
          color: colors.grey[100],
          fontSize: "14px",
          fontWeight: "bold",
          padding: "10px 20px",
        }}
      >
        <AddOutlinedIcon sx={{ mr: "10px" }} />
         Adicionar
      </Button>
      </Box>
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={mockDataDevices}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Devices;