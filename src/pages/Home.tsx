import { Autocomplete, Button, Container, Image } from "@mantine/core";
import classes from './Home.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState<{ title: string, slug: string }[]>([]);
    const navigate = useNavigate();

    const handleSearch = async (query: string) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/hymnals/search?title=${query}`);
            const result = await response.json();
            if (response.ok) {
                const data = result.data.map((item: any) => ({ title: item.title, slug: item.slug }));
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

    const loader = () => {
        const slug = getSlug();
        if (slug) {
            navigate(`/${slug}`);
        } else {
            console.error('Slug not found');
        }
    };

    return (
        <>
            <Image
                src="https://raw.githubusercontent.com/PoolMoo13/himnario-jovenes/master/public/logo192.png"
                height={90}
                width={409}
                fit="contain"
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
            <Container className={classes.Button}>
                <Button
                    variant="light"
                    radius="md"
                    w={150}
                    h={45}
                    onClick={loader}
                >
                    Entrar
                </Button>
            </Container>
        </>
    );
};

export default Home;
