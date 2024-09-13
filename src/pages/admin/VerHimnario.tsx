import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";


const SeleccionHimno = () => {
    const navigate = useNavigate();

    const navegacionEdit = () => {
      navigate('edit');
    };
  
    return (
      <>
        <div>Seleccionar Himno para editar</div>
        <Button onClick={navegacionEdit}>
          Guardar
        </Button>
      </>
    );
}

export default SeleccionHimno