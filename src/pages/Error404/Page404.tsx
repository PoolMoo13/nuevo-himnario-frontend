import { Image, Container, Title, Text, Button, SimpleGrid } from '@mantine/core';
import image from '../../../public/image.svg'
import classes from './Page404.module.css';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/');
    };
  return (
    <Container className={classes.root}>
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image src={image} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>Algo no está bien...</Title>
          <Text c="dimmed" size="lg">
          La página que intentas abrir no existe o no se encuentra disponible. Es posible que hayas escrito mal la dirección o que la página se haya movido a otra ruta. Si crees que se trata de un error, ponte en contacto con el servicio de asistencia.
          </Text>
          <Button variant="outline" size="md" mt="xl" className={classes.control}
            onClick={handleButtonClick}
          >
            Regresa a pagina principal
          </Button>
        </div>
        <Image src={image} className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  );
}