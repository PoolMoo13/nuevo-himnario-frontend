import { Anchor, Breadcrumbs, Button } from '@mantine/core';
import { Link, useParams } from 'react-router-dom';

interface Hymn {
    id: string;
    title: string;
    lyrics: string;
}

const ShowHymn = () => {

    const hymnsData = localStorage.getItem('hymns');
    const hymns: Hymn[] = hymnsData ? JSON.parse(hymnsData) : [];

    const { hymnalId, hymnId } = useParams<{ hymnalId: string, hymnId: string }>();

    const hymn = hymns.find(h => h.id.toString() === hymnId);


    if (!hymn || !hymn.lyrics) {
        console.error(`Himno con ID ${hymnId} no encontrado o sin letra.`);
        return (
            <>
                <p>El himno no está disponible. Busque otro himno</p>
                <Button
                    variant='light'
                    radius='md'
                    onClick={() => window.history.back()}
                >
                    Volver
                </Button>
            </>
        );
    }

    return (
        <>
            <Breadcrumbs separator="/" separatorMargin="md" mt="xs">
                <Anchor component={Link} to={ `/${hymnalId}` }>
                    Inicio
                </Anchor>
                {hymn && <Anchor>{hymn.title}</Anchor>}
            </Breadcrumbs>
            <h1>{hymn ? hymn.title : "Himno no encontrado"}</h1>
            {hymn ? (
                <div dangerouslySetInnerHTML={{ __html: hymn.lyrics }} />
            ) : (
                <p>El himno no está disponible.</p>
            )}
        </>
    );
};

export default ShowHymn;
