import React, { useEffect, useState } from "react";
import "./Styles/Styles.css";
import axios from "axios";
import profile from "../../../../Images/Default_pfp.svg.png";
import { saveAs } from 'file-saver';

function CreateStudents({ user, selected }) {
  const [subjects, setSubjects] = useState([]);
  const [groupNames, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    avatar: profile,
    foto: profile,
    tipoid: "",
    id: "",
    nombre: "",
    apellido: "",
    telefono: "",
    asignatura: [{ name: "", grupo: "" }],
    direccion: "",
    email: "",
  });

  //ACTUALIZA EL ESTADO DEL FORMDATA CUANDO UN INPUT CAMBIA
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
    } else if (name === "asignatura") {
      const newAsignatura = [...formData.asignatura];
      newAsignatura[0] = { ...newAsignatura[0], name: value };
      setFormData((prevState) => ({ ...prevState, asignatura: newAsignatura }));
    } else if (name === "grupo") {
      const newGroup = [...formData.asignatura];
      newGroup[0] = { ...newGroup[0], grupo: value };
      setFormData((prevState) => ({ ...prevState, asignatura: newGroup }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  //SIEMPRE QUE SE RENDERIZA EL COMPONENTE HACE UN GET DE LAS ASIGNATURAS DEL PROFESOR
  useEffect(() => {
    const handleSubjects = () => {
      axios
        .get(
          `http://localhost:3030/api/subjects/${user.email}`,
          { headers: { Authorization: `Bearer ${user.tokenSession}` } }
        )
        .then((response) => setSubjects(response.data));
    };
    handleSubjects();
  }, [selected]);

  //TRAE LOS GRUPOS SIEMPRE QUE UNA MATERIA ES SELECCIONADA
  useEffect(() => {
    const handleGroups = () => {
      const groupSubject = subjects.find(
        (subject) => subject.name === formData.asignatura[0].name
      );
      if (groupSubject && groupSubject.groups) {
        setGroups(groupSubject.groups.map((group) => group.name));
      }
    };
    handleGroups();
  }, [formData.asignatura]);

  //HACE EL POST A LA API DEPENDIENDO DEL CLICK DEL BOTON
  const NewStudent = (e) => {
    e.preventDefault();

    const Data = new FormData();
    formData.foto && Data.append("avatar", formData.foto);
    formData.tipoid != "" && Data.append("typeId", formData.tipoid);
    formData.id != "" && Data.append("identification", formData.id);
    formData.nombre != "" && Data.append("name", formData.nombre);
    formData.apellido != "" && Data.append("lastName", formData.apellido);
    formData.email != "" && Data.append("email", formData.email);
    formData.telefono != "" && Data.append("phoneNumber", formData.telefono);
    formData.direccion != "" && Data.append("address", formData.direccion);

    if (formData.asignatura[0].name !== "" && formData.asignatura[0].grupo !== "") {
      const subject = {
        subject: formData.asignatura[0].name,
        group: formData.asignatura[0].grupo,
      };
      const subjectsArray = [subject]; 
      const subjectsJSON = JSON.stringify(subjectsArray); 
      Data.append("asignatura", subjectsJSON);
    }
      axios
        .post(
          `http://localhost:3030/api/students/${user.email}`,
          Data,
          {
            headers: {
              Authorization: `Bearer ${user.tokenSession}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(() => {
          alert("Estudiante creado satisfactoriamente.");
        })
        .catch(() => {
          alert("No se pudo crear el estudiante, revisa los datos nuevamente.");
        });
  };

  //ABRE EL INPUT PARA SUBIR EL EXCEL
  const handleExcel = () => {
    const fileInput = document.getElementById("file-input");
    fileInput.click(); 
  };

  //HACE EL POST DE LOS ESTUDIANTES ATRAVES DE UN EXCEL
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const forData = new FormData();
    forData.append("template", file); 
    axios
      .post(`http://localhost:3030/api/students/excel/${user.email}`, forData, {
        headers: {
          Authorization: `Bearer ${user.tokenSession}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() =>
        alert("Estudiantes creados satisfactoriamente a través del excel.")
      )
      .catch(() =>
        alert(
          "No se pudo crear los estudiante, revisa los datos en el excel nuevamente."
        )
      );
  };

  //TRAE DE LA API UNA PLANTILLA DE EXCEL QUE ES GUIA PARA HACER EL POST CON EXCEL
  const handlePlantilla = () => {
    axios
      .get(
        "http://localhost:3030/api/template/template.xlsx",
        {
          headers: {
            Authorization: `Bearer ${user.tokenSession}`,
            Accept: "application/vnd.ms-excel",
          },
          responseType: "blob",
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.ms-excel",
        });
        saveAs(blob, "plantilla_estudiantes.xlsx");
      });
  };

  return (
    <div className='CreateStudents'>
      <form className='CreateStudents-form' onSubmit={NewStudent}>
        <img src={formData.avatar} alt='foto' className='CreateStudents_foto' />
        <input
          className=' input-foto'
          name='foto'
          type='file'
          onChange={handleInputChange}
        />
        <div className='CS_flex'>
          <div className='CS_flex-element'>
            <label>
              <strong>Tipo de documento</strong>
            </label>
            <br />
            <select
              className='select'
              value={formData.tipoid}
              name='tipoid'
              onChange={handleInputChange}
              required>
              <option></option>
              <option>Tarjeta de Identidad</option>
              <option>Cedula de Ciudadanía</option>
              <option>Cedula de Extranjería</option>
            </select>
            <br />
          </div>
          <div className='CS_flex-element'>
            <label>
              <strong>N° de identificación</strong>{" "}
            </label>
            <br />
            <input
              className='input'
              type="number"
              name='id'
              value={formData.id}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
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
              value={formData.nombre}
              name='nombre'
              onChange={handleInputChange}
              autoComplete="off"
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
              value={formData.apellido}
              name='apellido'
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <label>
          <strong>Teléfono</strong>
        </label>
        <input
          className='input text'
          type="number"
          value={formData.telefono}
          name='telefono'
          autoComplete="off"
          onChange={handleInputChange}
        />
        <label>
          <strong>Email</strong>
        </label>
        <input
          className='input text'
          type='email'
          value={formData.email}
          name='email'
          autoComplete="off"
          onChange={handleInputChange}
        />
        <div className='CS_flex'>
          <div className='CS_flex-element'>
            <label>
              <strong>Asignatura</strong>
            </label>
            <select
              className='select text'
              value={formData.asignatura[0].name}
              name='asignatura'
              onChange={handleInputChange}>
              <option></option>
              {subjects.map((subject) => {
              return (
                  <option key={subject.code}>{subject.name}</option>);
              })}              
            </select>
          </div>
          <div className='CS_flex-element'>
            <label>
              <strong>Grupo</strong>
            </label>
            <select
              className='select text'
              value={formData.asignatura[0].grupo}
              name='grupo'
              onChange={handleInputChange}>
              <option></option>
              {groupNames.map((group) => (
                <option key={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>
        <label>
          <strong>Dirección</strong>
        </label>
        <input
          className='input text'
          value={formData.direccion}
          autoComplete="off"
          name='direccion'
          onChange={handleInputChange}
        />
        <div className='CS_btns'>
          {" "}
          <button className='btn' type='button' onClick={handlePlantilla}>
            Plantilla de excel
          </button>
          <button className='btn' type='button' onClick={handleExcel}>
            Cargar excel
          </button>
          <button className='btn' type='submit' style={{margin: "0"}}>
            Guardar
          </button>
          <input
            id='file-input'
            type='file'
            onChange={handleFileInputChange}
            accept='.xlsx, .xls'
            style={{ display: "none" }}
          />
        </div>
      </form>
    </div>
  );
}

export default CreateStudents;