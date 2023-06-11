import { FormControlLabel, IconButton, Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {useNavigate} from 'react-router-dom';
import { tokens } from "../../theme";
import { mockDataDevices } from "../../data/mockData";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const Edit = () => {
  const handleEditClick = () => {
    // some action
  };

  return (
    <FormControlLabel
      control={
        <IconButton
          onClick={handleEditClick}
        >
          <EditOutlinedIcon/>
        </IconButton>
      }
    />
  );
};

const Delete = () => {
  const handleEditClick = () => {
    // some action
  };

  return (
    <FormControlLabel
      control={
        <IconButton
          onClick={handleEditClick}
        >
          <DeleteOutlinedIcon/>
        </IconButton>
      }
    />
  );
};

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
    {
      field: "edit",
      headerName: "Editar",
      flex: 0.5,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <Edit index={params.row.id} />
            <Delete index={params.row.id} />
          </div>
        );
      }
    }
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