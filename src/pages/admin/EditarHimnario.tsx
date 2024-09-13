import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const Titulo = () => {
  const navigate = useNavigate();

  const navegacionEdit = () => {
    navigate('himno');
  };

  return (
    <>
      <div>Titulo del Himnario a Editar</div>
      <Button onClick={navegacionEdit}>
        Guardar
      </Button>
    </>
  );
}

export default Titulo;
