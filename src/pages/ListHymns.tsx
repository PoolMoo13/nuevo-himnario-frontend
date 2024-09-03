import { useState, useEffect } from "react";
import { Autocomplete, Table } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";

interface Hymn {
    id: string;
    title: string;
    lyrics: string;
}

const ListHymns = () => {
    const [hymns, setHymns] = useState<Hymn[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    const getHimnarios = async () => {
        try {
            const url = `http://localhost:3001/api/hymnals/`;
            const res = await fetch(url);
            const { data } = await res.json();

            const himnos = data.map((hymn: any) =>
                hymn.hymnns.map((h: { id: string, title: string, lyrics: string }) => ({
                    id: h.id,
                    title: h.title,
                    lyrics: h.lyrics
                }))
            ).flat();

            const soloHimnos = Array.from(new Set(himnos.map(h => h.id)))
                .map(id => himnos.find(h => h.id === id));

            setHymns(soloHimnos);
        } catch (error) {
            console.error("No se pudo obtener los himnos: ", error);
        }
    };

    useEffect(() => {
        getHimnarios();
    }, []);

    const navegacionAlId = (id: string) => {
        navigate(`${location.pathname}/${id}`);
    };

    const handleAutocompleteChange = (title: string) => {
        const selectedHymn = hymns.find(hymn => hymn.title === title);
        if (selectedHymn) {
            navegacionAlId(selectedHymn.id);
        }
    };

    return (
        <>
            <h1>Lista de himnos</h1>

            <Autocomplete
                placeholder="Buscar Himnos"
                data={hymns.map(hymn => hymn.title)}
                limit={5}
                comboboxProps={{ dropdownPadding: 10 }}
                radius={"md"}
                variant="filled"
                h={70}
                onChange={handleAutocompleteChange}
            />

            <div>
            <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {hymns.map((hymn, index) => (
                        <tr 
                            key={hymn.id} 
                            style={{
                                backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                                cursor: 'pointer'
                            }}
                            onClick={() => navegacionAlId(hymn.id)}
                        >
                            <td style={{ padding: '10px 10px', color: "blue" }}>
                                {hymn.title}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
        </>
    );
};

export default ListHymns;
