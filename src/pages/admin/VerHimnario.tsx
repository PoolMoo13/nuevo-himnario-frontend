import { Anchor, Autocomplete, Breadcrumbs, Button, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Hymn {
  id: string;
  title: string;
  lyrics: string;
}

interface Hymnal {
  hymnns: Hymn[];
}

const apiUrl = import.meta.env.VITE_API_URL;

const VerHimnario = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [hymnal, setHymnal] = useState<Hymnal | null>(null);
  localStorage.setItem('hymnns', JSON.stringify(hymnal?.hymnns || []));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHimnos = async () => {
    try {
      if (!slug) return;

      const url = `${apiUrl}/search/slug?slug=${slug}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Error en la respuesta de la API');
      }
      const { data } = await res.json();

      if (data && data.length > 0) {
        setHymnal(data[0]);
      } else {
        setHymnal(null);
      }
    } catch (error) {
      setError(' ');
      console.error("No se pudo obtener los himnos: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHimnos();
  }, [slug]);

  const navegacionAlId = (id: string) => {
    navigate(`${id}`);
  };

  const handleAutocompleteChange = (title: string) => {
    const selectedHymn = hymnal?.hymnns.find(hymn => hymn.title === title);
    if (selectedHymn) {
      navegacionAlId(selectedHymn.id);
    }
  };

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Autocomplete
        placeholder="Buscar Himnos"
        data={[...new Set(hymnal?.hymnns.map(hymn => hymn.title) || [])]}  // Aquí se eliminan duplicados
        limit={5}
        comboboxProps={{ dropdownPadding: 10 }}
        radius="md"
        variant="filled"
        h={70}
        onChange={handleAutocompleteChange}
      />

      <Breadcrumbs separator="/" separatorMargin="md" mt="xs" style={{ paddingBottom: '30px' }}>
        <Anchor component={Link} to={`/admin/${slug}`}>
          Editar
        </Anchor>
        {hymnal && <Anchor>{slug}</Anchor>}
      </Breadcrumbs>
      {loading ? (
        <p>Cargando himnos...</p>
      ) : !hymnal || hymnal.hymnns.length === 0 ? (
        <p>No hay himnos disponibles en este himnario.</p>
      ) : (
        <Table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden' }}>
          <tbody>
            {hymnal.hymnns.map((hymn: Hymn, index: number) => (
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
      )}
      <Button
        onClick={() => navegacionAlId('crear')}
        variant='transparent'
        radius='md'
        style={{
          position: 'fixed',
          bottom: '60px',
          right: '40px',
          zIndex: 1000,
        }}
      >
        <img src="/signo-de-mas.png" alt="plus icon" width="60" height="60" />
      </Button>
    </>
  );
};

export default VerHimnario;
