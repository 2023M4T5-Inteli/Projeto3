import { Box, Button, TextField } from "@mui/material"; // Importação de componentes do Material-UI
import { Formik } from "formik"; // Importação do componente Formik para gerenciar formulários
import * as yup from "yup"; // Importação da biblioteca Yup para validação de esquemas
import useMediaQuery from "@mui/material/useMediaQuery"; // Hook para verificar a mídia em uso
import Header from "../../components/header"; // Importação do componente de cabeçalho personalizado
import { useParams } from "react-router-dom"; // Hook para acessar os parâmetros da rota
import { useState, useEffect } from "react"; // Hooks para gerenciar estado e efeitos colaterais

const UpdateTeam = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)"); // Verifica se a tela está em um dispositivo não móvel
  let params = useParams(); // Obtém os parâmetros da rota
  const [nome, setNome] = useState(""); // Hook useState para armazenar o nome
  const [email, setEmail] = useState(""); //  Hook useState para armazenar o email
  const [telefone, setTelefone] = useState(""); //  Hook useState para armazenar o telefone
  const [id_empresa, setId_empresa] = useState(""); //  Hook useState para armazenar o ID da empresa
  const url = "https://rd6rmm-3000.csb.app/func/"; // URL da API para realizar as requisições

  // Valores nulos iniciais do formulário
  const initialValues = {
    nome: "",
    email: "",
    contact: "",
    credencial: "",
  };

  useEffect(() => {
    // Função para buscar os valores do funcionário a ser atualizado
    fetch(url + params.id)
      .then((res) => res.json())
      .then((data) => {
        // Armazena os valores recebidos nas variaveis correspondentes
        setNome(data.nome);
        setEmail(data.email);
        setTelefone(data.telefone);
        setId_empresa(data.id_empresa);

        // Atualiza os valores iniciais do formulário com os valores recebidos
        initialValues.nome = data.nome;
        initialValues.email = data.email;
        initialValues.contact = data.telefone;
        initialValues.credencial = data.id_empresa;
      })
      .catch((error) => console.log(error));
  }, [params.id]);

  const handleFormSubmit = (values) => {
    // Função para receber a resposta do formulário de atualização
    fetch(url + params.id, {
      method: "PUT",
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
      <Header title="Atualizar Funcionário" subtitle={"Usuário ID " + params.id} />

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
              {/* Campo de texto para o nome do funcionario*/}
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
              {/* Campo de texto para o email do funcionario*/}
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
              {/* Campo de texto para o telefone do funcionario*/}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Telefone (XX)XXXXX-XXXX"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              {/* Campo de texto para a credencial do funcionario*/}
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
            {/* Botão para confirmar a atualização dos campos preenchidos*/}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Atualizar
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Expressão regular para validar números de telefone
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

// Função de validação do formulário
const checkoutSchema = yup.object().shape({
  nome: yup.string(),
  email: yup.string().email("invalid email"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid"),
  credencial: yup.string(),
});

// Exporta a função principal
export default UpdateTeam;
