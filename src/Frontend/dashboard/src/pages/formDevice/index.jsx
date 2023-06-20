import { Box, Button, TextField } from "@mui/material"; // Importando componentes do Material-UI
import { Formik } from "formik"; // Importando o Formik para gerenciar o estado do formulário
import * as yup from "yup"; // Importando o Yup para validação de formulários
import useMediaQuery from "@mui/material/useMediaQuery"; // Importando o hook useMediaQuery do Material-UI
import Header from "../../components/header"; // Importando o componente Header personalizado
import { useNavigate, Link } from 'react-router-dom'; // Importação dos hooks de navegação do React Router

const FormDevice = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)"); // Verifica se a tela não é mobile
  const url = "https://rd6rmm-3000.csb.app/dispo/"; // URL da API para realizar as requisições

  const handleFormSubmit = (values) => {
    // Função chamada quando o formulário é enviado. Realiza uma requisição POST para a API com os valores do formulário.
    fetch(url, {
      method: "POST",
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
          console.log("Criado com sucesso!");
        } else {
          console.log("Erro ao criar!");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <Box m="20px">
      <Header title="Adicionar Dispositivo" subtitle="Para ter acesso ao empréstimo de dispositivos" />

      <Formik
        onSubmit={handleFormSubmit} // Define a função de envio do formulário
        initialValues={initialValues} // Define os valores iniciais do formulário
        validationSchema={checkoutSchema} // Define o esquema de validação do formulário
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="mac"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.mac}
                name="mac"
                error={!!touched.mac && !!errors.mac}
                helperText={touched.mac && errors.mac}
                sx={{ gridColumn: "span 4" }}
              />
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
            <Box display="flex" justifyContent="end" mt="20px">
              <Link to={"/devices"}>
                <Button type="submit" color="secondary" variant="contained">
                  Adicionar
                </Button>
              </Link>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  setor: yup.string().required("required"), // Define uma validação para o campo "setor" (obrigatório)
  mac: yup.string().required("required"), // Define uma validação para o campo "email" (obrigatório e formato de email)
  ip: yup
    .string().required("required"), // Define que o campo "contact" é obrigatório
  });

const initialValues = {
  setor: "",
  mac: "",
  ip: "",
};

export default FormDevice;
