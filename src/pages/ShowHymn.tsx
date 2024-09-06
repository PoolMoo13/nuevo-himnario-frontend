import { Anchor, Breadcrumbs, Button } from '@mantine/core';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Hymn {
    id: string;
    title: string;
    lyrics: string;
}

const ShowHymn = () => {

    const [fontSize, setFontSize] = useState(16);

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

    const handlerFontSize = (incremento: number) => {
        setFontSize((tamanioActual) => tamanioActual + incremento);
    };

    return (
        <>
            <Breadcrumbs separator="/" separatorMargin="md" mt="xs" style={{ paddingTop: ' 10px ' }}>
                <Anchor component={Link} to={`/${hymnalId}`}>
                    Inicio
                </Anchor>
                {hymn && <Anchor>{hymn.title}</Anchor>}
            </Breadcrumbs>
            {hymn ? (
                <div dangerouslySetInnerHTML={{ __html: hymn.lyrics }} style={{ fontSize: `${fontSize}px`, paddingTop: '10px'}} />
            ) : (
                <p>El himno no está disponible.</p>
            )}

            <Button
                onClick={() => handlerFontSize(2)}
                variant='light'
                radius='md'
                style={{
                    position: 'fixed',
                    bottom: '20px', 
                    right: '70px',  
                    zIndex: 1000,  
                }}
            >
                +
            </Button>
            <Button
                onClick={() => handlerFontSize(-2)}
                variant='light'
                radius='md'
                style={{
                    position: 'fixed',
                    bottom: '20px', 
                    right: '20px',  
                    zIndex: 1000,  
                }}
            >
                -
            </Button>
        </>
    );
};

export default ShowHymn;
