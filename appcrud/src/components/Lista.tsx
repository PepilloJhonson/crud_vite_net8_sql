import { useEffect, useState } from "react";
import { appsettings } from "../settings/appsettings";
import Swal from "sweetalert2";
import { IEmpleado } from "../Interfaces/IEmpleado";
import { Container, Row, Col, Table, Button } from "reactstrap";
import Modal from "./Modal"; 
import { NuevoEmpleado } from "./NuevoEmpleado"; 
import { EditarEmpleado } from "./EditarEmpleado"; 
import logo from '../assets/logo.png'; 

export function Lista() {
    const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'nuevo' | 'editar'>('nuevo');
    const [selectedEmpleado, setSelectedEmpleado] = useState<IEmpleado | null>(null);

    const obtenerEmpleados = async () => {
        const response = await fetch(`${appsettings.apiUrl}Empleado/Lista`);
        if (response.ok) {
            const data = await response.json();
            setEmpleados(data);
        }
    };

    useEffect(() => {
        obtenerEmpleados();
    }, []);

    const Eliminar = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Eliminar empleado!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${appsettings.apiUrl}Empleado/Eliminar/${id}`, { method: "DELETE" });
                if (response.ok) await obtenerEmpleados();
            }
        });
    };

    const toggleModal = () => setModalOpen(!modalOpen);

    const handleEditClick = (empleado: IEmpleado) => {
        setSelectedEmpleado(empleado);
        setModalType('editar');
        toggleModal();
    };

    const handleNewClick = () => {
        setSelectedEmpleado(null);
        setModalType('nuevo');
        toggleModal();
    };

    return (
      <Container className="mt-5">
          <Row className="align-items-center">
              <Col sm={{ size: 8, offset: 2 }} className="d-flex justify-content-between align-items-center">
                  {/* Logo a la izquierda */}
                  <img src={logo} alt="Logo" style={{ width:'150px', height:'auto', marginRight:'10px' }} />
                  {/* Título */}
                  <h4>Lista de empleados</h4>
                  {/* Botón para nuevo empleado */}
                  <Button color="success" onClick={handleNewClick}>Nuevo Empleado</Button>
              </Col>

              {/* Tabla de empleados */}
              <Col sm={{ size: 8, offset: 2 }}>
                  <hr />
                  <Table bordered>
                      <thead>
                          <tr>
                              <th>Nombre</th>
                              <th>Correo</th>
                              <th>Sueldo</th>
                              <th></th>
                          </tr>
                      </thead>
                      <tbody>
                          {empleados.map((item) => (
                              <tr key={item.idEmpleado}>
                                  <td>{item.nombre}</td>
                                  <td>{item.correo}</td>
                                  <td>{item.sueldo}</td>
                                  <td>
                                      {/* Botones para editar y eliminar */}
                                      <Button color="primary me-2" onClick={() => handleEditClick(item)}>
                                          Editar
                                      </Button>
                                      <Button color="danger" onClick={() => Eliminar(item.idEmpleado!)}>
                                          Eliminar
                                      </Button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </Table>

                  {/* Componente Modal */}
                  {modalOpen && (
                      <Modal 
                          isOpen={modalOpen} 
                          toggle={toggleModal} 
                          title={modalType === 'nuevo' ? 'Nuevo Empleado' : `Editar Empleado - ${selectedEmpleado?.nombre}`}>
                          
                          {modalType === 'nuevo' ? (
                              // Pasamos la función para cerrar el modal y actualizar la lista
                              <NuevoEmpleado onClose={() => { toggleModal(); obtenerEmpleados(); }} />
                          ) : (
                              selectedEmpleado && selectedEmpleado.idEmpleado !== undefined && (
                                  // Solo pasamos el ID si es un número
                                  <EditarEmpleado id={selectedEmpleado.idEmpleado} onClose={() => { toggleModal(); obtenerEmpleados(); }} />
                              )
                          )}
                          
                      </Modal>
                  )}
              </Col>

          </Row>

      </Container>

  );
}
