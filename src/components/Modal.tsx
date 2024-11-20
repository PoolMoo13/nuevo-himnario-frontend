// ModalSinPermisos.jsx
import React from "react";
import { Modal, PasswordInput, Group, Button, Text } from "@mantine/core";

const ModalSinPermisos = ({ opened, onClose, onSubmit, value, password, setPassword }) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Contraseña requerida"
            centered
            size="md"
        >
            <Text size="sm" mt="md">
                Ingrese la contraseña para: <strong>{value}</strong>
            </Text>

            <PasswordInput
                variant="filled"
                size="md"
                radius="md"
                placeholder="Contraseña"
                mt="lg"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                required
            />

            <Group mt="xl">
                <Button variant="outline" color="red" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="filled" color="blue" onClick={onSubmit}>
                    OK
                </Button>
            </Group>
        </Modal>
    );
};

export default ModalSinPermisos;
