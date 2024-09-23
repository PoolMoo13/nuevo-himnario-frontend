import { Button, Group, TextInput, PasswordInput, Container, Title, Paper, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from '@mantine/form';

const ApiUrl = import.meta.env.VITE_API_URL;

const EditarHimnario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const slugEdit = location.pathname.split("/").pop();

  // metodo para la pagina de crear

  const [name, setName] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleCrear = (event) => {
    event.preventDefault();
  };

  const form = useForm({
    initialValues: {
      title: '',
      slug: '',
      password: '',
      passwordEdit: '',
      description: '',
      _id: '',
    },
  });

  const handleSearch = async (slug: string) => {
    if (!slug) return;

    try {
      const response = await fetch(`${ApiUrl}/search/slug?slug=${slug}`);
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (response.ok && result.data.length > 0) {
          form.setValues(result.data[0]);
        } else {
          console.error("Error fetching data:", result.error);
        }
      } else {
        console.error("Error: Received non-JSON response");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    if (slugEdit != crear) {
      handleSearch(slugEdit);
    }
  }, [slugEdit]);

  const handleSubmit = async (values) => {
    console.log("🚀 ~ file: EditarHimnario.tsx:52 ~ handleSubmit ~ values:", values);

    const payload = {
      data: {
        title: values.title,
        slug: values.slug,
        description: values.description,
        passwordEdit: values.passwordEdit,
        password: values.password,
      },
    };

    const url = `${ApiUrl}/${values._id}`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Server responded with an error');
      }

      const data = await response.json();
      console.log('Success:', data);
      navigate('edit');
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <Container size="sm" my="xl">
      <Paper shadow="xl" radius="md" p="lg" >
        <Title align="center" order={2} mb="lg" style={{ color: '#3b3b3b' }}>
          Editar Himnario
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <TextInput
              withAsterisk
              label="Título"
              placeholder="Ingresa el título del himnario"
              {...form.getInputProps('title')}
              style={{ fontWeight: 500 }}
            />
            <TextInput
              withAsterisk
              label="Slug"
              placeholder="Ingresa el slug del himnario"
              {...form.getInputProps('slug')}
              style={{ fontWeight: 500 }}
            />
            <TextInput
              label="Descripción"
              placeholder="Ingrese una descripción para el himnario"
              {...form.getInputProps('description')}
              style={{ fontWeight: 500 }}
            />
            <PasswordInput
              label="Contraseña para ingresar al Himnario"
              placeholder="Contraseña para ingresar al himnario"
              {...form.getInputProps('password')}
              style={{ fontWeight: 500 }}
            />
            <PasswordInput
              label="Contraseña para editar el himnario"
              placeholder="Contraseña para editar el himnario"
              {...form.getInputProps('passwordEdit')}
              style={{ fontWeight: 500 }}
            />
            <Group position="center" mt="md">
              <Button
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                type="submit"
                disabled={form.values.title === '' || form.values.slug === ''}
              >
                Guardar
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default EditarHimnario;
