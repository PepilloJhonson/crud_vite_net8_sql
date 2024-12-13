// src/components/Modal.tsx
import React from 'react';
import { Modal as BootstrapModal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

interface ModalProps {
    isOpen: boolean; // Estado para controlar si el modal está abierto
    toggle: () => void; // Función para alternar el estado del modal
    title: string; // Título del modal
    children: React.ReactNode; // Contenido del modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, toggle, title, children }) => {
    return (
        <BootstrapModal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody>
                {children}
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Cerrar</Button>
            </ModalFooter>
        </BootstrapModal>
    );
};

export default Modal;
