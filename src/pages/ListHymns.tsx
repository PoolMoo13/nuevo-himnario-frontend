import { Autocomplete } from "@mantine/core";
import { useState, useEffect } from "react";

interface Hymn {
    id: number;
    title: string;
    lyrics: string;
}

const ListHymns = () => {
    const [hymnData, setHymnData] = useState<{ value: string, label: string }[]>([]);
    const [allTitles, setAllTitles] = useState<string[]>([]);

    const getHimnarios = async () => {
        const url = `http://localhost:3001/api/hymnals/`;
        const res = await fetch(url);
        const { data } = await res.json();

        const himnos = data.map((hymn: Hymn) => hymn.hymnns.map((h: { id: number, title: string, lyrics: string }) => ({
            value: h.title,
            label: `${h.title} - ${h.lyrics}`
        }))).flat();

        const titles = himnos.map(h => h.value);

        setHymnData(himnos);
        setAllTitles(titles);
        console.log("🚀 ~ file: ListHymns.tsx:16 ~ himnos ~ himnos:", himnos);
        console.log("🚀 ~ file: Home.tsx:11 ~ getHimnarios ~ data:", data);
    };

    useEffect(() => {
        getHimnarios();
    }, []);

    return (
        <>
            <h1>Lista de himnos</h1>

            <Autocomplete
                placeholder="Buscar Himnos"
                data={hymnData}
            />

            <h2>Todos los títulos de los himnos</h2>
            <ul>
                {allTitles.map((title, index) => (
                    <li key={index}>{title}</li>
                ))}
            </ul>
        </>
    );
};

export default ListHymns;
