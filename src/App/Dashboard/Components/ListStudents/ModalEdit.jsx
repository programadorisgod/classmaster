import axios from "axios";
import Modal from 'react-modal';
import { RxCross1 } from "react-icons/rx";
import profile from "../../../../Images/Default_pfp.svg.png";
import { useState } from "react";
import SweetAlert from 'react-bootstrap-sweetalert';

Modal.setAppElement('#root');

export function ModalEdit({formData, modalIsOpen, setModalIsOpen, setFormData, data, user, getStudentsGroup}) {
    const [showAlert, setShowAlert] = useState(false);
    const hideAlert = () => {
        setShowAlert(false);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "foto") {
            const file = event.target.files[0];
            const reader = new FileReader();
            try {
                reader.onload = () => {
                    setFormData({ ...formData, avatar: reader.result, foto: file });
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.log("Error");
            }
        } else {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
        }
    };
    const NewStudent = (e) => {
        e.preventDefault();

        const Data = new FormData();
        formData.foto && Data.append("avatar", formData.foto);
        formData.tipoid !== "" && Data.append("typeId", formData.tipoid);
        formData.id !== "" && Data.append("identification", formData.id);
        formData.nombre !== "" && Data.append("name", formData.nombre);
        formData.apellido !== "" && Data.append("lastName", formData.apellido);
        formData.email !== "" && Data.append("email", formData.email);
        formData.telefono !== "" && Data.append("phoneNumber", formData.telefono);
        formData.direccion !== "" && Data.append("address", formData.direccion);

        if (data.subject !== "" && data.group !== "" && data.subject !== undefined && data.group !== undefined) {
            axios
                .patch(
                    `https://server-classmaster-production.up.railway.app/api/students/${user.email}/${data.subject}/${data.group}/${formData.id}`,
                    Data,
                    {
                        headers: {
                            Authorization: `Bearer ${user.tokenSession}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then(() => {
                    setShowAlert(true);
                    setModalIsOpen(false)
                    getStudentsGroup();
                    
                })
                .catch((error) => {
                    alert("No se pudo actualizar el estudiante, revisa los datos nuevamente." + error);
                });
        }
    };


    return (
        <>
        <Modal isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)} 
            className="Modal"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }                
            }}>      <button
                className="close-button"
                onClick={() => setModalIsOpen(false)}
                style={{
                    position: 'absolute',
                    right: '25px',
                }}
            >
                <RxCross1 />
            </button>

            <h2
                style={{
                    margin:"0 0 0 30px",
                    fontSize: "20px",
                    color: "mediumpurple",
                }}
            >
                Editar estudiante
            </h2>
        <form className="form_editStudent"onSubmit={NewStudent} width={100}>
                <img src={formData.avatar === "https://server-classmaster-production.up.railway.app/api/images/undefined" ? profile : formData.avatar } alt='foto' className='CreateStudents_foto' />
            <input
                className=' input-foto'
                    style={{
                        margin: "0.5rem 0 0.5rem 34%"
                    }}
                name='foto'
                type='file'
                onChange={handleInputChange}
            />
            <div className='CS_flex'>
                <div className='CS_flex-element'>
                    <label>
                        <strong>N° de identificación</strong>{" "}
                    </label>
                    <br />
                    <input
                        type="number"
                        className='input'
                        name='id'
                        value={formData.id}
                        autoComplete="off"
                        onChange={handleInputChange}
                        disabled
                    />
                    <br />
                </div>
                <div className='CS_flex-element'>
                    <label>
                        <strong>Tipo de documento</strong>
                    </label>
                    <br />
                    <select
                        className='select'
                        name='tipoid'
                        value={formData.tipoid}
                        onChange={handleInputChange}
                        required>
                        <option>Tarjeta de Identidad</option>
                        <option>Cedula de Ciudadanía</option>
                        <option>Cedula de Extranjería</option>
                    </select>
                    <br />
                </div>
            </div>
            <div className='CS_flex'>
                <div className='CS_flex-element'>
                    <label>
                        <strong>Nombres</strong>
                    </label>
                    <input
                        type='text'
                        className='input text'
                        name='nombre'
                        value={formData.nombre}
                        autoComplete="off"
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='CS_flex-element'>
                    <label>
                        <strong>Apellidos </strong>
                    </label>
                    <input
                        type='text'
                        className='input text'
                        name='apellido'
                        value={formData.apellido}
                        autoComplete="off"
                        onChange={handleInputChange}
                        required
                    />
                </div>
            </div>
            <label>
                <strong>Teléfono</strong>
            </label>
            <input
                type="number"
                className='input text'
                name='telefono'
                value={formData.telefono}
                autoComplete="off"
                onChange={handleInputChange}
            />
            <label>
                <strong>Email</strong>
            </label>
            <input
                className='input text'
                type='email'
                name='email'
                value={formData.email}
                autoComplete="off"
                onChange={handleInputChange}
            />

            <label>
                <strong>Dirección</strong>
            </label>
            <input
                className='input text'
                name='direccion'
                value={formData.direccion}
                autoComplete="off"
                onChange={handleInputChange}
            />
            <div className='CS_btns'>
                    <button className='btn' type='submit' style={{ margin: '0' }}>
                    Actualizar
                </button>
            </div>
        </form>
    </Modal>
     {showAlert && (
            <SweetAlert
                success
                title="Actualizado correctamente!"
                onConfirm={hideAlert}
            />
        )
    }
    </>
    )
};