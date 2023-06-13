import { Box, Button, TextField } from "@mui/material"; // Importando componentes do Material-UI
import { Formik } from "formik"; // Importando o Formik para gerenciar o estado do formulário
import * as yup from "yup"; // Importando o Yup para validação de formulários
import useMediaQuery from "@mui/material/useMediaQuery"; // Importando o hook useMediaQuery do Material-UI
import Header from "../../components/header"; // Importando o componente Header personalizado

const FormTeam = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)"); // Verifica se a tela não é mobile
  const url = "https://rd6rmm-3000.csb.app/func/"; // URL da API para realizar as requisições

  const handleFormSubmit = (values) => {
    // Função chamada quando o formulário é enviado. Realiza uma requisição POST para a API com os valores do formulário.
    fetch(url, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: values.nome,
        id_empresa: values.credencial,
        email: values.email,
        telefone: values.contact
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
      <Header title="Adicionar Funcionário" subtitle="Para ter acesso ao empréstimo de dispositivos" />

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
                label="Nome"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nome}
                name="nome"
                error={!!touched.nome && !!errors.nome}
                helperText={touched.nome && errors.nome}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Telefone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Credencial"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.credencial}
                name="credencial"
                error={!!touched.credencial && !!errors.credencial}
                helperText={touched.credencial && errors.credencial}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Adicionar
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  nome: yup.string().required("required"), // Define uma validação para o campo "nome" (obrigatório)
  email: yup.string().email("invalid email").required("required"), // Define uma validação para o campo "email" (obrigatório e formato de email)
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid") // Define uma validação para o campo "contact" (formato de telefone)
    .required("required"), // Define que o campo "contact" é obrigatório
  credencial: yup.string().required("required"), // Define uma validação para o campo "credencial" (obrigatório)
});

const initialValues = {
  nome: "",
  email: "",
  contact: "",
  credencial: "",
};

export default FormTeam;
