import { Box, Button, TextField } from "@mui/material"; // Importação de componentes do Material-UI
import { Formik } from "formik"; // Importação do componente Formik para gerenciar formulários
import { useNavigate, Link } from 'react-router-dom'; // Importação dos hooks de navegação do React Router
import * as yup from "yup"; // Importação da biblioteca Yup para validação de esquemas
import useMediaQuery from "@mui/material/useMediaQuery"; // Hook para verificar a mídia em uso
import Header from "../../components/header"; // Importação do componente de cabeçalho personalizado
import { useParams } from "react-router-dom"; // Hook para acessar os parâmetros da rota
import { useState, useEffect } from "react"; // Hooks para gerenciar estado e efeitos colaterais

const UpdateDevice = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)"); // Verifica se a tela está em um dispositivo não móvel
  let params = useParams(); // Obtém os parâmetros da rota
  const [setor, setSetor] = useState(""); // Hook useState para armazenar o nome
  const [mac, setMac] = useState(""); //  Hook useState para armazenar o email
  const [ip, setIp] = useState(""); //  Hook useState para armazenar o telefone
  const url = "https://rd6rmm-3000.csb.app/dispo/"; // URL da API para realizar as requisições

  // Valores nulos iniciais do formulário
  const initialValues = {
    setor: "",
    mac: "",
    ip: "",
  };

  useEffect(() => {
    // Função para buscar os valores do funcionário a ser atualizado
    fetch(url + params.id)
      .then((res) => res.json())
      .then((data) => {
        // Armazena os valores recebidos nas variaveis correspondentes
        setSetor(data.setor);
        setMac(data.mac);
        setIp(data.ip);

        // Atualiza os valores iniciais do formulário com os valores recebidos
        initialValues.setor = data.setor;
        initialValues.mac = data.mac;
        initialValues.ip = data.ip;
      })
      .catch((error) => console.log(error));
  }, [params.id]);

  const handleFormSubmit = (values) => {
    // Função para receber a resposta do formulário de atualização
    fetch(url + params.id, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setor: values.setor,
        mac: values.mac,
        ip: values.ip
      })
    })
      .then(res => { // Verifica se está funcionando
        console.log(values);
        if (res.ok) {
          console.log("Atualizado com sucesso!");
        }
        else {
          console.log("Erro ao atualizar!");
        }
      })
      .catch((error) => console.log(error))
  };

  return (
    <Box m="20px" onLoad={console.log(params.id)}>
      {/* Componente de cabeçalho */}
      <Header title="Atualizar Dispositivo" subtitle={"Dispositivo ID " + params.id} />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Campo de texto para o setor*/}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Setor"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.setor}
                name="setor"
                error={!!touched.setor && !!errors.setor}
                helperText={touched.setor && errors.setor}
                sx={{ gridColumn: "span 4" }}
              />
              {/* Campo de texto para o mac*/}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Mac"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.mac}
                name="mac"
                error={!!touched.mac && !!errors.mac}
                helperText={touched.mac && errors.mac}
                sx={{ gridColumn: "span 4" }}
              />
              {/* Campo de texto para o ip*/}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ip"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ip}
                name="ip"
                error={!!touched.ip && !!errors.ip}
                helperText={touched.ip && errors.ip}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            {/* Botão para confirmar a atualização dos campos preenchidos*/}
            <Box display="flex" justifyContent="end" mt="20px">
              <Link to={"/devices"}>
                <Button type="submit" color="secondary" variant="contained">
                  Atualizar
                </Button>
              </Link>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Função de validação do formulário
const checkoutSchema = yup.object().shape({
  setor: yup.string(),
  mac: yup.string(),
  ip: yup
    .string()
});

// Exporta a função principal
export default UpdateDevice;
