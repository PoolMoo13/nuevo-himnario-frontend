import { Autocomplete } from "@mantine/core";

interface Hymn {
    id: number;
    title: string;
    lyrics: string;
};

const ListHymns = () => {

    const getHimnarios = async () => {

        const url = `http://localhost:3001/api/hymnals/`
        const res = await fetch(url);
        const { data } = await res.json();

        const himnos = data.map( Hymn =>  ({
            id: hymn.hymnns.id,
            title: hymn.hymnns.title,
            lyrics: hymn.hymnns.lyrics
        }))
        console.log("🚀 ~ file: ListHymns.tsx:16 ~ himnos ~ himnos:", himnos)
        // console.log("🚀 ~ file: Home.tsx:11 ~ getHimnarios ~ data:", data)
    }

    getHimnarios();

    return (<>
        <h1>Lista de himnos</h1>

        <Autocomplete
            placeholder="Buscar Himnos"
            data={[ 'Himno 1', 'Himno 2', 'Himno 3' ]}
        />
    </>
    )
};

export default ListHymns;
