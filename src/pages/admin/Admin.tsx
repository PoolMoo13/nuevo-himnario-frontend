import {
    Autocomplete,
    Button,
    Container,
    Group,
    Image,
    Modal,
    PasswordInput,
    Text,
    Alert,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Admin.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconInfoCircle } from "@tabler/icons-react";

const ApiUrl = import.meta.env.VITE_API_URL;

interface Hymnal {
    title: string;
    slug: string;
    password: string;
    passwordEdit?: string;
}

const Admin = () => {
    const icon = <IconInfoCircle />;
    const [opened, { open, close }] = useDisclosure(false);
    const [suggestions, setSuggestions] = useState<Hymnal[]>([]);
    const [value, setValue] = useState("");
    const [password, setPassword] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (query: string) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
    
        try {
            const response = await fetch(`${ApiUrl}?title=${query}`);
            const contentType = response.headers.get("content-type");
    
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                if (response.ok) {
                    const uniqueTitles = new Set();
                    const data = result.data
                        .filter((item: Hymnal) => {
                            if (item && item.title && !uniqueTitles.has(item.title)) {
                                uniqueTitles.add(item.title);
                                return true;
                            }
                            return false;
                        })
                        .map((item: Hymnal) => ({
                            title: item.title,
                            slug: item.slug,
                            password: item.password,
                            passwordEdit: item.passwordEdit,
                        }));
                    setSuggestions(data);
                } else {
                    console.error("Error fetching data:", result.error);
                    setSuggestions([]);
                }
            } else {
                console.error("Error: Received non-JSON response");
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error:", error);
            setSuggestions([]);
        }
    };
    

    const getSlug = () => {
        const selectedItem = suggestions.find((item) => item.title === value);
        return selectedItem ? selectedItem.slug : null;
    };

    const getPassword = () => {
        const selectedItem = suggestions.find((item) => item.title === value);
        return selectedItem ? selectedItem.passwordEdit : null;
    };

    const handleSubmitPassword = () => {
        const savedPassword = getPassword();
        if (savedPassword === password) {
            const slug = getSlug();
            if (slug) {
                navigate(`/admin/${slug}`);
            } else {
                alert("Slug not found");
            }
        } else {
            alert("Contraseña incorrecta");
        }
    };

    const handleSubmitNavegate = () => {
        navigate(`/admin/crear`);
    };

    return (
        <>
            <Image
                src="https://raw.githubusercontent.com/PoolMoo13/himnario-jovenes/master/public/logo192.png"
                height={90}
                width={409}
                fit="contain"
                alt="Logo"
            />
            <Container className={classes.MultiSelect}>
                <Autocomplete
                    placeholder="Selecciona Himnario O Crea uno Nuevo"
                    data={suggestions.map((item) => item.title).filter(Boolean)}
                    value={value}
                    onChange={(val) => {
                        setValue(val);
                        handleSearch(val);
                    }}
                />
            </Container>
            <Modal
                opened={opened}
                onClose={close}
                title="Contraseña requerida"
                centered
                size="md"
            >
                <Text size="sm" mt="md">
                    Ingrese la contraseña para: <strong>{value}</strong>
                </Text>

                <PasswordInput
                    variant="filled"
                    size="md"
                    radius="md"
                    placeholder="Contraseña"
                    mt="lg"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    required
                />

                <Group mt="xl">
                    <Button variant="outline" color="red" onClick={close}>
                        Cancelar
                    </Button>
                    <Button variant="filled" color="blue" onClick={handleSubmitPassword}>
                        OK
                    </Button>
                </Group>
            </Modal>

            <Container className={classes.Button}>
                <Button
                    variant="light"
                    radius="md"
                    w={150}
                    h={45}
                    onClick={() => {
                        if (!value) {
                            setAlertVisible(true);
                        } else if (!getPassword()) {
                            handleSubmitPassword();
                        } else {
                            open();
                        }
                    }}
                >
                    Editar
                </Button>
                <Button
                    variant="light"
                    radius="md"
                    w={150}
                    h={45}
                    onClick={handleSubmitNavegate}
                >
                    Crear
                </Button>
            </Container>

            {alertVisible && (
                <Alert
                    className={classes['alert-enter']}
                    variant="light"
                    radius="md"
                    color="blue"
                    title="Himnario no seleccionado"
                    icon={icon}
                    withCloseButton
                    onClose={() => setAlertVisible(false)}
                >
                    Seleccione primero un himnario para editar.
                </Alert>
            )}
        </>
    );
};

export default Admin;
