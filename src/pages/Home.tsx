import { Autocomplete, Button, Container, Group, Image, Modal, PasswordInput, Text } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import classes from './Home.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const ApiUrl = import.meta.env.VITE_API_URL;


interface Hymnal {
    title: string;
    slug: string;
    password: string;
}

const Home = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [suggestions, setSuggestions] = useState<Hymnal[]>([]);
    const [value, setValue] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (query: string) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`${ ApiUrl }?title=${query}`);
            const result = await response.json();
            if (response.ok) {
                const data = result.data.map((item: Hymnal) => ({
                    title: item.title,
                    slug: item.slug,
                    password: item.password
                }));
                setSuggestions(data);
            } else {
                console.error('Error fetching data:', result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getSlug = () => {
        const selectedItem = suggestions.find(item => item.title === value);
        return selectedItem ? selectedItem.slug : null;
    };

    const getPassword = () => {
        const selectedItem = suggestions.find(item => item.title === value);
        return selectedItem ? selectedItem.password : null;
    };

    const handleSubmitPassword = () => {
        const savedPassword = getPassword();
        if (savedPassword === password) {
            const slug = getSlug();
            if (slug) {
                navigate(`/${slug}`);
            } else {
                alert('Slug not found');
            }
        } else {
            alert("Contraseña incorrecta");
        }
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
                    placeholder="Buscar himno"
                    data={suggestions.map(item => item.title)}
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
                    <Button variant="outline" color="red" onClick={close}>Cancelar</Button>
                    <Button variant="filled" color="blue" onClick={handleSubmitPassword}>OK</Button>
                </Group>
            </Modal>

            <Container className={classes.Button}>
                <Button
                    variant="light"
                    radius="md"
                    w={150}
                    h={45}
                    onClick={
                        () => {
                            if (!getPassword()) {
                                handleSubmitPassword();
                            } else {
                                open();
                            }
                        }
                    }
                    disabled={!value}
                >
                    Entrar
                </Button>
            </Container>
        </>
    );
};

export default Home;
