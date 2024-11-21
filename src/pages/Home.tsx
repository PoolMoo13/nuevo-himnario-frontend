import { Autocomplete, Button, Container, Image } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import classes from './Home.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalSinPermisos from "../components/Modal";

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
            const response = await fetch(`${ApiUrl}?title=${query}`);
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
                sessionStorage.setItem('pwd', `${slug}`);
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
            <ModalSinPermisos
                opened={opened}
                onClose={close}
                onSubmit={handleSubmitPassword}
                value={value}
                password={password}
                setPassword={setPassword}
            />

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
