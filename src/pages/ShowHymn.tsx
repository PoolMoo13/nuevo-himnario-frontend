import { useState, useEffect } from 'react';
import { Anchor, Breadcrumbs } from '@mantine/core';
import { Link, useParams } from 'react-router-dom';

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
const ShowHymn = () => {
    const [hymns, setHymns] = useState<Hymn[]>([]);
    const { hymnId, hymnalId } = useParams<{ hymnId: string; hymnalId: string }>();

    const getHimnarios = async () => {
        try {
            if (!hymnalId) {
                return;
            }
            const url = `http://localhost:3001/api/hymnals/search/slug?slug=${hymnalId}`;
            const res = await fetch(url);
            const { data } = await res.json();

            const himnos = data.map((hymnal: Hymnal) =>
                hymnal.hymnns.map((hymn: Hymn) => ({
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
    }, []);

    const buscarHimnoPorId = (id: string): Hymn | undefined => {
        return hymns.find(hymn => hymn.id === id);
    };

    const himno = buscarHimnoPorId(hymnId || '');
    const tituloHimno: string = himno ? himno.title : 'no se encontró el himno';

    const items = [
        { title: 'Inicio', path: `/${hymnalId}` },
        { title: `${tituloHimno}`, path: `#` },
    ].map((item, index) => (
        <Anchor component={Link} to={item.path} key={index}>
            {item.title}
        </Anchor>
    ));

    return (
        <>
            <h1>{tituloHimno}</h1>
            <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
                {items}
            </Breadcrumbs>
            {himno && (
                <div>
                    <h2>Letra del himno:</h2>
                    <p>{himno.lyrics}</p>
                </div>
            )}
        </>
    );
};

export default ShowHymn;
