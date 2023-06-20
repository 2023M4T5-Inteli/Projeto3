import { tokens } from "../../theme"; // Importação do módulo "tokens" do tema personalizado
import { useNavigate, Link } from 'react-router-dom'; // Importação dos hooks de navegação do React Router
import Header from "../../components/header"; // Importação do componente de cabeçalho personalizado
import { useEffect, useState } from "react"; // Importação dos hooks useEffect e useState do React
import { FormControlLabel, IconButton, Box, Button } from "@mui/material"; // Importação de componentes do Material-UI
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Importação do componente de tabela do Material-UI
import { useTheme } from "@mui/material"; // Importação do hook useTheme do Material-UI
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'; // Importação do ícone de adição do Material-UI
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'; // Importação do ícone de edição do Material-UI
import DeleteIcon from '@mui/icons-material/DeleteOutlined'; // Importação do ícone de exclusão do Material-UI

const Edit = (props) => {
  const handleEditClick = () => {
    // Função de callback para manipular o clique no botão de edição
  };

  return (
    <FormControlLabel
      control={
        <Link to={"/updateDevice/" + props.index}> {/* Hook Link para redirecionar para a página '/updateTeam'*/}
          <IconButton
            onClick={handleEditClick}
          >
            <EditOutlinedIcon /> {/* Ícone de edição */}
          </IconButton>
        </Link>
      }
    />
  );
};

const Delete = (props) => {
  const handleDeleteClick = () => {
    props.onDelete(props.index); // Chama a função onDelete passando o índice(id) do item a ser excluído
  };

  return (
    <FormControlLabel
      control={
        <IconButton
          onClick={handleDeleteClick}
        >
          <DeleteIcon /> {/* Ícone de exclusão */}
        </IconButton>
      }
    />
  );
};

const Device = () => {

  const [rowsDevice, setRowsDevice] = useState([]); // Estado para armazenar os dados dos DISPOSITIVOS
  const url = "https://rd6rmm-3000.csb.app/dispo"; // URL para buscar os dados dos DISPOSITIVOS

  useEffect(() => {
    // Hook useEffect para buscar os dados dos DISPOSITIVOS 
    fetch(url)
      .then(res => res.json())
      .then(data => setRowsDevice(data))
      .catch(error => console.log(error))
  }, [])

  useEffect(() => {
    // Hook useEffect para exibir os dados dos DISPOSITIVOS no console sempre que houver uma atualização no estado rowsTeam
    console.log(rowsDevice)
  }, [rowsDevice])

  const navigate = useNavigate(); // Hook useNavigate para navegar entre páginas
  const theme = useTheme(); // Hook useTheme para obter o tema atual
  const colors = tokens(theme.palette.mode); // Obtem os tokens de cores personalizados do tema

  const navigateForm = () => {
    navigate('/formDevice'); // Função de callback para navegar para a página '/formTeam' ao clicar no botão "Adicionar"
  };

  const handleDelete = (id) => {
    // Função para excluir um funcionário com base no seu ID
    fetch(url + "/" + id, {
      method: "DELETE"
    })
      .then(res => {
        if (res.ok) {
          console.log("Excluído com sucesso!");
          // Atualiza a lista de DISPOSITIVOS removendo o item excluído
          setRowsDevice(prevRows => prevRows.filter(row => row.id !== id));
        }
        else {
          console.log("Erro ao excluir!");
        }
      })
      .catch((error) => console.log(error));
  };

  const columns = [
    // Definição das colunas da tabela
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "setor",
      headerName: "Setor",
      flex: 1,
    },
    {
      field: "mac",
      headerName: "MAC",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "ip",
      headerName: "IP",
      flex: 1,
    },
    {
      field: "edit",
      headerName: "Editar",
      flex: 0.5,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        // Função para renderizar as células da coluna "Editar"
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <Edit index={params.row.id} /> {/* Renderiza o componente "Edit" passando o índice do funcionário*/}
            <Delete index={params.row.id} onDelete={handleDelete} /> {/* Renderiza o componente "Delete" passando o índice e a função de exclusão*/}
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
        <Button onClick={navigateForm} // Renderiza o componente de cabeçalho personalizado
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <AddOutlinedIcon sx={{ mr: "10px" }} /> {/* Ícone de adição */}
          Adicionar
        </Button>
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
          rows={rowsDevice} // Define as linhas a partir da constante definida que recebe os dados do banco de dados
          columns={columns}
          components={{ Toolbar: GridToolbar }} // Utiliza o componente GridToolbar como a barra de ferramentas da tabela
        />
      </Box>
    </Box>
  );
};

// Exporta a função principal
export default Device;
