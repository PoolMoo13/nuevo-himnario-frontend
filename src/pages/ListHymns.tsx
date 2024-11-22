import { useState, useEffect } from "react";
import { Autocomplete, Skeleton, Table } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import ModalSinPermisos from "../components/Modal";

interface Hymn {
    id: string;
    title: string;
    lyrics: string;
}

interface Hymnal {
    title: string;
    password: string;
    slug: string;
    hymnns: Hymn[];
}

const apiUrl = import.meta.env.VITE_API_URL;

const ListHymns = () => {
    const navigate = useNavigate();
    const { hymnalId } = useParams();

    const [opened, setOpened] = useState(false);
    const [password, setPassword] = useState("");
    const [sessionValid, setSessionValid] = useState(false);
    const [contra, setContra] = useState("");
    const [loading, setLoading] = useState(true);
    const [hymns, setHymns] = useState<Hymn[]>([]);

    const fetchHymns = async () => {
        try {
            if (!hymnalId) return;

            const res = await fetch(`${apiUrl}/search/slug?slug=${hymnalId}`);
            const { data } = await res.json();

            const hymnsList = data
                .flatMap((hymnal: Hymnal) =>
                    hymnal.hymnns.map((hymn) => ({
                        id: hymn.id,
                        title: hymn.title,
                        lyrics: hymn.lyrics,
                    }))
                );

            setHymns(hymnsList);
        } catch (error) {
            console.error("No se pudo obtener los himnos:", error);
        }
    };

    const fetchHymnalData = async (slug: string) => {
        try {
            if (!slug) return;

            const res = await fetch(`${apiUrl}/search/slug?slug=${slug}`);
            const { data } = await res.json();

            if (res.ok && data.length > 0) {
                const { password } = data[0];
                setContra(password);
                if (!password || password.trim() === "") {
                    setSessionValid(true);
                }
            } else {
                console.error("Error fetching hymnal data");
            }
        } catch (error) {
            console.error("Error en la búsqueda:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPassword = () => {
        if (!contra || contra.trim() === "") {
            setSessionValid(true);
        }
        if (password === contra) {
            sessionStorage.setItem("pwd", `${hymnalId}`);
            setOpened(false);
            setSessionValid(true);
        } else {
            alert("Contraseña incorrecta");
        }
    };
    

    const handleAutocompleteChange = (title: string) => {
        const selectedHymn = hymns.find((hymn) => hymn.title === title);
        if (selectedHymn) navigate(`${selectedHymn.id}`);
    };

    useEffect(() => {
        const session = sessionStorage.getItem("pwd") === `${hymnalId}`;

        if (session) {
            setSessionValid(true);
        } else {
            setOpened(true);
        }

        if (hymnalId && hymnalId !== "crear") {
            fetchHymnalData(hymnalId);
        } else {
            setLoading(false);
        }
    }, [hymnalId]);

    useEffect(() => {
        fetchHymns();
    }, [hymnalId]);

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
                value={hymnalId || ""}
                onSubmit={handleSubmitPassword}
                password={password}
                setPassword={setPassword}
            />
        );
    }

    return (
        <>
            <Autocomplete
                placeholder="Buscar Himnos"
                data={hymns.map((hymn) => hymn.title)}
                limit={5}
                comboboxProps={{ dropdownPadding: 10 }}
                radius="md"
                variant="filled"
                onChange={handleAutocompleteChange}
                style={{ marginBottom: "20px" }}
            />

            <Table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                    {hymns.map((hymn, index) => (
                        <tr
                            key={hymn.id}
                            style={{
                                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                                cursor: "pointer",
                            }}
                            onClick={() => navigate(`${hymn.id}`)}
                        >
                            <td style={{ padding: "10px", color: "#4499E9" }}>
                                {hymn.title}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default ListHymns;
