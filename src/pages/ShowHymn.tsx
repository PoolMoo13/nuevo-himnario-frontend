import { useState, useEffect } from 'react';
import { Breadcrumbs, Anchor } from '@mantine/core';
import { useLocation } from 'react-router-dom';

interface Hymn {
    id: string;
    title: string;
    lyrics: string;
}

const ShowHymn = () => {
    const [hymns, setHymns] = useState<Hymn[]>([]);
    const pathname = useLocation().pathname;

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
    
    const id = pathname.split('/').pop();
    
    const buscarHimnoPorId = (id: string): string => {
        const himno = hymns.find(hymn => hymn.id === id);
        console.log("🚀 ~ file: ShowHymn.tsx:46 ~ buscarHimnoPorId ~ himno:", himno);
        return himno ? himno.title : '';
    };
    const tituloHimno: string = buscarHimnoPorId(id);

    const himnario = pathname.split('/');
    const getUrlHimnario = himnario[himnario.length - 2];


    const items = [
        { title: 'Inicio', href: `http://localhost:5173/${getUrlHimnario}` },
        { title: `${tituloHimno}`, href: '#' },
    ].map((item, index) => (
        <Anchor href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    return (
        <>
            <h1>Show Hymn</h1>
            <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
                {items}
            </Breadcrumbs>
            {/* You can now use the hymns state to render the hymns list or any additional content */}
        </>
    );
};

export default ShowHymn;
