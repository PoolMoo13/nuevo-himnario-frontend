import { useState, useEffect } from "react";
import { Autocomplete, Table } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

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

const ListHymns = () => {
    const [hymns, setHymns] = useState<Hymn[]>([]);
    localStorage.setItem('hymns', JSON.stringify(hymns));    
    const navigate = useNavigate();
    const { hymnalId } = useParams(); 

    const getHimnarios = async () => {
        try {
            if (!hymnalId) {
                return;
            }  
            const url = `http://localhost:3001/api/hymnals/search/slug?slug=${hymnalId}`;
            const res = await fetch(url);
            const { data } = await res.json();

            const himnos = data.map((hymnal: Hymnal) =>
                hymnal.hymnns.map(( hymn: Hymn ) => ({
                    id: hymn.id,
                    title: hymn.title,
                    lyrics: hymn.lyrics
                }))
            ).flat();

            setHymns(himnos);
        } catch (error) {
            console.error("No se pudo obtener los himnos: ", error);
        }
    };

    useEffect(() => {
        getHimnarios();
    }, [hymnalId]); 

    const navegacionAlId = (id: string) => {
        navigate(`${id}`);
    };

    const handleAutocompleteChange = (title: string) => {
        const selectedHymn = hymns.find(hymn => hymn.title === title);
        if (selectedHymn) {
            navegacionAlId(selectedHymn.id);
        }
    };

    return (
        <>
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
                                <td style={{ padding: '10px 10px', color: "#4499E9" }}>
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
