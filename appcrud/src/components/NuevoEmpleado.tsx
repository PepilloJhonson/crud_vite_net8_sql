import { ChangeEvent, useState } from "react";
import { appsettings } from "../settings/appsettings";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IEmpleado } from "../Interfaces/IEmpleado";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";

const initialEmpleado = {
    nombre: "",
    correo: "",
    sueldo: 0
};

interface NuevoEmpleadoProps {
    onClose: () => void; // Prop para cerrar el modal
}

export function NuevoEmpleado({ onClose }: NuevoEmpleadoProps) {
    const [empleado, setEmpleado] = useState<IEmpleado>(initialEmpleado);
    const navigate = useNavigate();

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        setEmpleado({ ...empleado, [inputName]: inputValue });
    };

    const validarDatos = () => {
        if (!empleado.nombre || !empleado.correo || empleado.sueldo <= 0) {
            Swal.fire({
                title: "Error!",
                text: "Todos los campos son obligatorios.",
                icon: "warning"
            });
            return false;
        }

        // Validar que el nombre no contenga números
        if (/\d/.test(empleado.nombre)) {
            Swal.fire({
                title: "Error!",
                text: "El nombre no puede contener números.",
                icon: "warning"
            });
            return false;
        }

        // Validar formato de correo electrónico
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(empleado.correo)) {
            Swal.fire({
                title: "Error!",
                text: "Por favor ingrese un correo electrónico válido.",
                icon: "warning"
            });
            return false;
        }

        return true;
    };

    const guardar = async () => {
        if (!validarDatos()) return; // Validar antes de guardar

        const response = await fetch(`${appsettings.apiUrl}Empleado/Nuevo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleado)
        });
        if (response.ok) {
            onClose(); // Cierra el modal
            navigate("/"); // Navega a la lista después de guardar
        } else {
            Swal.fire({
                title: "Error!",
                text: "No se pudo guardar el empleado",
                icon: "warning"
            });
        }
    };

    const volver = () => {
        onClose(); // Cierra el modal sin guardar
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col sm={{ size: 8, offset: 2 }}>
                    <h4>Nuevo Empleado</h4>
                    <hr />
                    <Form>
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" name="nombre" onChange={inputChangeValue} value={empleado.nombre} required />
                        </FormGroup>
                        <FormGroup>
                            <Label>Correo</Label>
                            <Input type="email" name="correo" onChange={inputChangeValue} value={empleado.correo} required />
                        </FormGroup>
                        <FormGroup>
                            <Label>Sueldo</Label>
                            <Input type="number" name="sueldo" onChange={inputChangeValue} value={empleado.sueldo} required />
                        </FormGroup>
                    </Form>
                    <Button color="primary" className="me-4" onClick={guardar}>Guardar</Button>
                    <Button color="secondary" onClick={volver}>Volver</Button>
                </Col>
            </Row>
        </Container>
    );
}
