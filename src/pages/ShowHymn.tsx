import { Anchor, Breadcrumbs } from '@mantine/core';
import { Link, useParams } from 'react-router-dom';

interface Hymn {
    id: string;
    title: string;
    lyrics: string;
}

const ShowHymn = () => {

    const hymnsData = localStorage.getItem('hymns');
    const hymns: Hymn[] = hymnsData ? JSON.parse(hymnsData) : [];
    console.log("🚀 ~ file: ShowHymn.tsx:13 ~ ShowHymn ~ hymns:", hymns);

    const { hymnId } = useParams<{ hymnId: string }>();
    

    return (
        <>
            <h1>{tituloHimno}</h1>
            <Breadcrumbs separator="/" separatorMargin="md" mt="xs">
                <Anchor component={Link} to="/">
                    Inicio
                </Anchor>
                <Anchor>
                    {tituloHimno}
                </Anchor>
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
