import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const EditarHimnario = () => {
  const navigate = useNavigate();

  const navegacionEdit = () => {
    navigate('himno');
  };

  return (
    <>
      <div>EditarHimnario del Himnario a Editar</div>
      <Button onClick={navegacionEdit}>
        Guardar
      </Button>
    </>
  );
}

export default EditarHimnario;
