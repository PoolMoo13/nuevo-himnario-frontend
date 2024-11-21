import { useEffect, useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import { Button, Group, TextInput, PasswordInput, Container, Title, Paper, Stack, Alert, Skeleton } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { IconAlertCircle } from '@tabler/icons-react'; 
import ModalSinPermisos from "../../components/Modal";

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
  const [alertVisible, setAlertVisible] = useState(false); 

  const [opened, setOpened] = useState(false); 
  const [password, setPassword] = useState(""); 
  const [value, setValue] = useState(""); 
  const [sessionValid, setSessionValid] = useState(false);
  const [contra, setContra] = useState(false);
  const [loading, setLoading] = useState(true);

  const slugRef = useRef('');

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
    const session = sessionStorage.getItem('pwd');
    if (session !== `${slugEdit}`) {
      setOpened(true); 
      setValue(`${slugEdit}`);
    } else {
      setSessionValid(true);
    }
  }, []);

  const handleSubmitPassword = () => {
    if (password === `${contra}`) {
      sessionStorage.setItem('pwd', `${slugEdit}`); 
      setOpened(false); 
      setSessionValid(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  useEffect(() => {
    setAlertVisible(false); 
  }, []);

  useEffect(() => {
    if (slugEdit && slugEdit !== 'crear') {
      handleSearch(slugEdit);
    } else {
      setLoading(false);
    }
  }, [slugEdit]);

  useEffect(() => {
    const createSlug = (title: string) =>
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newSlug = createSlug(form.values.title);
    if (slugEdit === 'crear') {
      form.setFieldValue('slug', newSlug);
    }
    slugRef.current = newSlug;
  }, [form.values.title]);

  useEffect(() => {
    if (form.values.slug && form.values.slug !== originalSlug && !loading) {
      const debounceTimeout = setTimeout(() => {
        checkSlug(form.values.slug);
      }, 500);
  
      return () => clearTimeout(debounceTimeout);
    }
  }, [form.values.slug, loading]);
  

  const handleSearch = async (slug: string) => {
    if (!slug) return;
  
    try {
      const response = await fetch(`${ApiUrl}/search/slug?slug=${slug}`);
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (response.ok && result.data.length > 0) {
          const { passwordEdit, password, ...rest } = result.data[0];
          form.setValues({...rest, password, passwordEdit});
          setContra(passwordEdit);
          setOriginalSlug(result.data[0].slug);
          form.setFieldValue('slug', result.data[0].slug); 
          if (!passwordEdit || passwordEdit.trim() === "") {
            setSessionValid(true);
        }
        } else {
          console.error("Error fetching data:", result.error);
        }
      } else {
        console.error("Error: Received non-JSON response");
      }
    } catch (error) {
      console.error("Syntax error:", error);
    } finally {
      setLoading(false); 
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
      } else {
        setSlugExists(false);
      }
      form.validateField('slug');
    } catch (error) {
      console.error("Error checking slug:", error);
    } finally {
      setCheckingSlug(false);
    }
  };
  

  const handleSubmit = async (values: FormValues) => {
    if (!values.title || !values.slug) {
      setAlertVisible(true);
      return; 
    }

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
      setAlertVisible(false); 
      await handleSearch(values.slug);

      const newPath = location.pathname.replace(slugEdit === 'crear' ? 'crear' : originalSlug, `${values.slug}/hymnns`);
      navigate(newPath, { replace: true });
      

    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Skeleton height={50} circle mb="xl" />
        <Skeleton height={8} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} width="70%" radius="xl" />
      </>
    );
  }

  if (!sessionValid) {
    return (
      <ModalSinPermisos
        opened={opened}
        onClose={() => setOpened(false)}
        onSubmit={handleSubmitPassword}
        value={value}
        password={password}
        setPassword={setPassword}
      />
    );
  }


  return (
    <Container size="sm" my="xl">
      <Paper shadow="xl" radius="md" p="lg">
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
              placeholder="..."
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
                // disabled={slugExists && form.values.slug !== originalSlug || checkingSlug}
              >
                Guardar
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
      {alertVisible && (
        <Alert
          variant="light"
          radius="md"
          color="blue"
          title="Campos"
          icon={<IconAlertCircle size={16} />}
          withCloseButton
          onClose={() => setAlertVisible(false)}
          style={{
            position: 'fixed',
            right: '15px',
            left: '15px',
            animation: 'slideInFromRight 0.5s ease forwards',
            padding: '20px',
            margin: '10px',
            bottom: '90px',
          }}
        >
          Todos los campos obligatorios deben estar completos.
        </Alert>
      )}
      <style>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1; 
          }
        }
      `}</style>
    </Container>
  );
};

export default EditarHimnario;
