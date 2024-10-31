import React, { useState, useEffect, useCallback } from 'react';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

const apiUrl = import.meta.env.VITE_API_URL;

const EditHimno: React.FC = () => {
  const [slugExists, setSlugExists] = useState(false);
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const [titulo, setTitulo] = useState<string>('');
  const [nextId, setNextId] = useState<number | null>(null);
  const [ids, setIds] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const pathSegments = location?.pathname?.split("/") || [];
  const slugEdit = pathSegments[pathSegments.length - 3];
  const hymnId = pathSegments[pathSegments.length - 1];

  const form = useForm({
    initialValues: { title: '' },
    validate: {
      title: (value: string) => {
        if (slugExists && value) return 'Este título ya existe, elige uno diferente.';
        return null;
      },
    },
  });

  const getHimnos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/search/slug?slug=${slugEdit}`);
      if (!res.ok) throw new Error('Error en la respuesta de la API');

      const { data } = await res.json();
      if (!data || data.length === 0) throw new Error('No se encontró el himno');

      const himno = data[0];
      setIds(himno._id);

      const maxId = himno.hymnns?.length ? Math.max(...himno.hymnns.map((h: any) => h.id)) : 0;
      setNextId(maxId + 1);

      let tempTitulo = '';
      let tempEditorState = EditorState.createEmpty();

      if (!isNaN(Number(hymnId))) {
        const existingHymn = himno.hymnns.find((hymn: any) => hymn.id === Number(hymnId));

        if (existingHymn) {
          tempTitulo = existingHymn.title;
          if (existingHymn.lyrics) {
            const contentBlock = convertFromHTML(existingHymn.lyrics);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
            tempEditorState = EditorState.createWithContent(contentState);
          }
        }
      }

      setTitulo(tempTitulo);
      setEditorState(tempEditorState);
    } catch (error) {
      console.error("Error al obtener himnos:", error);
    } finally {
      setLoading(false);
    }
  }, [slugEdit, hymnId]);

  useEffect(() => {
    getHimnos();
  }, [getHimnos]);

  const checkSlug = useCallback(async (titulo: string) => {
    if (!titulo || !isNaN(Number(hymnId))) {
      setSlugExists(false);
      setIsButtonDisabled(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/search/slug?slug=${slugEdit}`);
      const result = await response.json();

      if (response.ok && result.data.length > 0) {
        const hymnsInHimnario = result.data[0].hymnns || [];
        const titleExists = hymnsInHimnario.some((hymn: any) => hymn.title === titulo && hymn._id !== hymnId);

        setSlugExists(titleExists);
        setIsButtonDisabled(titleExists);

        if (titleExists) form.setFieldError('title', 'Este título ya existe, elige uno diferente.');
        else form.clearFieldError('title');
      } else {
        setSlugExists(false);
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error checking slug:", error);
    }
  }, [slugEdit, hymnId, form]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => checkSlug(titulo), 500);
    return () => clearTimeout(debounceTimeout);
  }, [titulo, checkSlug]);

  const handleButtonClick = async () => {
    const options = {
      inlineStyleFn: (styles) => {
        const key = 'color-';
        const color = styles.find((value) => value.startsWith(key));
  
        if (color) {
          return {
            element: 'span',
            style: {
              color: color.replace(key, ''),
            },
          };
        }
      },
    };
  
    const htmlContent = stateToHTML(editorState.getCurrentContent(), options);
    console.log("HTML content with styles:", htmlContent);
  
    await actualizarHimno(htmlContent);
  };
  

  const actualizarHimno = async (htmlContent) => {
    if (!ids || !nextId) return;
  
    setLoading(true);
  
    const updatedHymn = { id: nextId, title: titulo, lyrics: htmlContent };
    console.log("Contenido de htmlContent:", htmlContent);
  
    const hymns = JSON.parse(localStorage.getItem('hymnns') || '[]');
    const hymnIndex = hymns.findIndex((hymn) => hymn.id === Number(hymnId));
  
    if (hymnIndex >= 0) {
      hymns[hymnIndex] = { ...hymns[hymnIndex], title: titulo, lyrics: htmlContent };
    } else {
      hymns.push(updatedHymn);
    }
  
    try {
      const res = await fetch(`${apiUrl}/${ids}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { hymnns: hymns } }),
      });
  
      if (!res.ok) throw new Error('Error al actualizar el himno');
  
      const responseData = await res.json();
      setTitulo(responseData.hymnns[0].title);
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(
        convertFromHTML(responseData.hymnns[0].lyrics).contentBlocks
      )));
  
      localStorage.setItem('hymnns', JSON.stringify(hymns));
    } catch (error) {
      console.error("Error actualizando himno:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ width: '90%', margin: '0 auto', padding: '10px' }}>
      <TextInput
        placeholder="Título del himno"
        withAsterisk
        required
        style={{ width: '100%', height: '40px', fontSize: '16px', marginBottom: '20px' }}
        value={titulo}
        onChange={(event) => setTitulo(event.currentTarget.value)}
        error={form.errors.title}
      />
      <div style={{ padding: '10px', minHeight: '400px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbar={{
            options: ["inline", "blockType", "fontSize", "fontFamily", "list", "textAlign", "colorPicker", "remove", "history"],
            inline: {
              inDropdown: false,
              options: ["bold", "italic", "underline", "strikethrough", "monospace"],
            },
          }}
          toolbarClassName="custom-toolbar-class"
          wrapperClassName="editor-wrapper"
          editorClassName="editor-class"
        />
      </div>
      <Button
        variant="light"
        onClick={handleButtonClick}
        style={{ margin: '20px 0', opacity: loading ? 0.7 : 1 }}
        loading={loading}
        disabled={isButtonDisabled || slugExists}
      >
        Actualizar
      </Button>
    </div>
  );
};

export default EditHimno;
