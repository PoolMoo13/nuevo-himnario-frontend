import React, { useState, useEffect, useCallback } from 'react';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import { useNavigate, useParams } from 'react-router-dom';
import { IconColumns, IconColumnsOff } from '@tabler/icons-react';


import "./EditarHimno.scss"
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

const apiUrl = import.meta.env.VITE_API_URL;

const EditHimno: React.FC = () => {
  const [slugExists, setSlugExists] = useState(false);
  const [titulo, setTitulo] = useState<string>('');
  const [nextId, setNextId] = useState<number | null>(null);
  const [ids, setIds] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [editorContent, setEditorContent] = useState('')
  const navigate = useNavigate();
  const { hymnalId, slug } = useParams();

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
      const maxId = himno.hymnns?.length ? Math.max(...himno.hymnns.map(h => h.id)) : 0;
      setNextId(maxId + 1);

      const existingHymn = hymnId && himno.hymnns.find(hymn => hymn.id === Number(hymnId));
      if (existingHymn) {
        setTitulo(existingHymn.title);
        setEditorContent(existingHymn.lyrics || '');
      }
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
    await actualizarHimno();
    navigate(`/admin/${slug}/${hymnalId}`);
  };


  const actualizarHimno = async () => {
    if (!ids || !nextId) return;

    setLoading(true);

    const updatedHymn = { id: nextId, title: titulo, lyrics: editorContent };
    const hymns = JSON.parse(localStorage.getItem('hymnns') || '[]');
    const hymnIndex = hymns.findIndex((hymn) => hymn.id === Number(hymnId));

    if (hymnIndex >= 0) {
      hymns[hymnIndex] = { ...hymns[hymnIndex], title: titulo, lyrics: editorContent };
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
      setEditorContent(responseData.hymnns[0].lyrics);
      localStorage.setItem('hymnns', JSON.stringify(hymns));
    } catch (error) {
      console.error("Error actualizando himno:", error);
    } finally {
      setLoading(false);
    }
  };

  const editor = useEditor({

    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Edite o Cree su himno' }),
      Color,
      TextStyle,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      if (newContent !== editorContent) {
        setEditorContent(newContent);
      }
    },
  });


  useEffect(() => {
    if (editor && editorContent) {
      if (editor.getHTML() !== editorContent) {
        editor.commands.setContent(editorContent);
      }
    }
  }, [editor, editorContent]);


  return (
    <>
      <TextInput
        placeholder="Título del himno"
        withAsterisk
        required
        style={{ width: '100%', height: '40px', fontSize: '16px', marginBottom: '20px' }}
        value={titulo}
        onChange={(event) => setTitulo(event.currentTarget.value)}
        error={form.errors.title}
      />
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            {/* <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup> */}

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <AddTable />
              <DeleteColumn />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ColorPicker
              colors={[
                '#25262b',
                '#868e96',
                '#fa5252',
                '#e64980',
                '#be4bdb',
                '#7950f2',
                '#4c6ef5',
                '#228be6',
                '#15aabf',
                '#12b886',
                '#40c057',
                '#82c91e',
                '#fab005',
                '#fd7e14',
              ]}
            />
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content
            style={{ height: 'auto', minHeight: '35vh', overflowY: 'auto' }}
          >
          </RichTextEditor.Content>
        </RichTextEditor>
      <Button
        variant="light"
        onClick={handleButtonClick}
        style={{ margin: '20px 0', opacity: loading ? 0.7 : 1 }}
        loading={loading}
        disabled={isButtonDisabled || slugExists || titulo === '' || editorContent === ''}
      >
        Actualizar
      </Button>
    </>

  );
};

function AddTable() {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => {
        if (editor) {
          editor.commands.insertContent(
            '<table><tr><td>Columna 1</td><td>Columna 2</td></tr></table>'
          );
          editor.chain().focus().run();
        }
      }}
      aria-label="Insertar tabla"
      title="Insertar tabla"
    >
      <IconColumns stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
}



function DeleteColumn() {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor?.chain().focus()
          .deleteColumn()
          .run();
      }}
      aria-label="Eliminar columna"
      title="Eliminar Columna"
    >
      <IconColumnsOff stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
}

export default EditHimno;