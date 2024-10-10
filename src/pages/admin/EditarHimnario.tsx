import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { Button, Group, TextInput, PasswordInput, Container, Title, Paper, Stack } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
interface FormValues {
  title: string;
  slug: string;
  password: string;
  passwordEdit: string;
  description: string;
  _id: string;
}

const ApiUrl = import.meta.env.VITE_API_URL;

const EditarHimnario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const slugEdit = location.pathname.split("/").pop();

  const [slugExists, setSlugExists] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [originalSlug, setOriginalSlug] = useState('');

  const form = useForm({
    initialValues: {
      title: '',
      slug: '',
      password: '',
      passwordEdit: '',
      description: '',
      _id: '',
    },
    validate: {
      slug: (value) => {
        if (slugExists && value !== originalSlug) {
          return 'Este slug ya existe, elige uno diferente.';
        }
        return null;
      },
    },
  });

  useEffect(() => {
    if (slugEdit && slugEdit !== 'crear') {
      handleSearch(slugEdit);
    }
  }, [slugEdit]);

  useEffect(() => {
    const createSlug = (title: string) =>
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newSlug = createSlug(form.values.title);
    form.setFieldValue('slug', newSlug);
  }, [form.values.title]);

  useEffect(() => {
    if (form.values.slug && form.values.slug !== originalSlug) {
      const debounceTimeout = setTimeout(() => {
        checkSlug(form.values.slug);
      }, 500);

      return () => clearTimeout(debounceTimeout);
    }
  }, [form.values.slug]);

  const handleSearch = async (slug: string) => {
    if (!slug) return;
    try {
      const response = await fetch(`${ApiUrl}/search/slug?slug=${slug}`);
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (response.ok && result.data.length > 0) {
          form.setValues(result.data[0]);
          setOriginalSlug(result.data[0].slug);
        } else {
          console.error("Error fetching data:", result.error);
        }
      } else {
        console.error("Error: Received non-JSON response");
      }
    } catch (error) {
      console.error("Syntax error:", error);
    }
  };

  const checkSlug = async (slug: string) => {
    if (!slug) return;
    setCheckingSlug(true);
    try {
      const response = await fetch(`${ApiUrl}/search/slug?slug=${slug}`);
      const result = await response.json();
      if (response.ok && result.data.length > 0) {
        setSlugExists(true);
        form.validateField('slug');
      } else {
        setSlugExists(false);
        form.validateField('slug');
      }
    } catch (error) {
      console.error("Error checking slug:", error);
    }
    setCheckingSlug(false);
  };


  const handleSubmit = async (values: FormValues) => {
    const method = slugEdit === 'crear' ? 'POST' : 'PATCH';
    const url = slugEdit === 'crear' ? `${ApiUrl}` : `${ApiUrl}/${values._id}`;
    const payload = slugEdit === 'crear' ? {
      slug: values.slug,
      title: values.title,
      description: values.description,
      password: values.password,
      passwordEdit: values.passwordEdit,
      hymnns: [],
    } : {
      data: {
        slug: values.slug,
        title: values.title,
        description: values.description,
        password: values.password,
        passwordEdit: values.passwordEdit,
        hymnns: [],
      },
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
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
        <Title order={2} mb="lg" style={{ color: '#3b3b3b', textAlign: 'center' }}>
          {slugEdit === 'crear' ? 'Crear Himnario' : 'Editar Himnario'}
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              withAsterisk
              label="Título"
              placeholder="Ingresa el título del himnario"
              {...form.getInputProps('title')}
            />
            <TextInput
              withAsterisk
              label="Slug"
              placeholder="Ingresa el slug del himnario"
              {...form.getInputProps('slug')}
              error={form.errors.slug}
            />
            {checkingSlug && <div>Verificando disponibilidad del slug...</div>}
            <TextInput
              label="Descripción"
              placeholder="Ingrese una descripción para el himnario"
              {...form.getInputProps('description')}
            />
            <PasswordInput
              label="Contraseña para ingresar al Himnario"
              placeholder="Contraseña para ingresar al himnario"
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label="Contraseña para editar el himnario"
              placeholder="Contraseña para editar el himnario"
              {...form.getInputProps('passwordEdit')}
            />
            <Group align="center" mt="md">
              <Button
                variant="light"
                type="submit"
                disabled={slugExists && form.values.slug !== originalSlug || checkingSlug}
              >
                Guardar
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default EditarHimnario;
