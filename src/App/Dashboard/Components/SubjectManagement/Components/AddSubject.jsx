import { useEffect, useState } from 'react'
import axios from 'axios';
import { BsArrowLeft } from 'react-icons/bs'
import { AddSubjectSchedule } from './AddSubjectSchedule'
import plus from "../../../../../Images/iconmonstr-plus-lined.svg";
import minus from "../../../../../Images/iconmonstr-line-one-horizontal-lined.svg"
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export function AddSubject ({ user, subject = {name: "", code: ""}, isEdit = "", handlePassSubjects, getSubjects }) {
  const [values, setValues] = useState({name: subject.name, code: subject.code, group: subject.group || 1, schedules: subject.schedules || []})
  const [handleEdit, setHandleEdit] = useState({name: false, code: false, group: false, schedules: false, submit: false})
  const [title, setTitle] = useState("Agregar asignatura")
  const groupName = subject.group && subject.group.toString()

  useEffect(() => {
    switch (isEdit) {
      case "editSubject":
        setHandleEdit({ name: false, code: true, group: true, schedules: true, submit: false})
        setTitle("Editar asignatura")
        break;
      case "addGroup":
        setHandleEdit({ name: true, code: true, group: false, schedules: false, submit: false})
        setTitle("Agregar grupo")
        break;
      case "group":
        setHandleEdit({ name: true, code: true, group: true, schedules: true, submit: true })
        setTitle(`Grupo: ${subject.group}`)
        break;
      case "groupEdit":
        setHandleEdit({ name: true, code: true, group: false, schedules: false, submit: false })
        setTitle(`Editar Grupo: ${subject.group}`)
        break;
      default:
        setHandleEdit({ name: false, code: false, group: false, schedules: false, submit: false})
        setTitle("Agregar asignatura")
        break;
    }
  },[isEdit])

  function goBackAndGet() {
    getSubjects()
    handlePassSubjects(false)
  }

  const handleInput = (e) => {
    setValues({...values, [e.target.name]: e.target.value})
  }

  const handleSetSchedules = (updatedSchedule, index) => {
    const updatedSchedules = [...values.schedules];
    updatedSchedules[index] = updatedSchedule;
    setValues({ ...values, schedules: updatedSchedules });
  };

  function handleAddSchedule() {
    setValues({ ...values, schedules: [...values.schedules, {day: "Lunes", starTime: "08:00", endTime: "10:00"}] });
  }

  const handleRemoveSchedule = () => {
    const updatedSchedules = [...values.schedules];
    updatedSchedules.splice(values.schedules.length - 1, 1);
    setValues({ ...values, schedules: updatedSchedules });
  };

  function handleSubmit(e) {
    e.preventDefault()
    switch (isEdit) {
      case "editSubject":
        editSubjectSubmit()
        break;
      case "addGroup":
        values.schedules.length == 0 ? alert("Defina el horario de este grupo por favor") : addGroupSubmit()
        break;
      case "groupEdit":
        values.schedules.length == 0 ? alert("Defina el horario de este grupo por favor") : editGroupSubmit()
        break;
      default:
        values.schedules.length == 0 ? alert("Defina el horario de esta asignatura/grupo por favor") : addSubjectSubmit()
        break;
    }
  }

  function editGroupSubmit() {
    axios
      .patch(`http://localhost:3030/api/subjects/${user.email}/${subject.code}`, 
        {
          currentGroup: groupName,
          groups: [
            {
              name: values.group.toString(),
              schedule: values.schedules
            }
          ]
        }, 
        {
          headers: {
            Authorization: `Bearer ${user.tokenSession}`
          }
        }
      )
      .then(() => {
        alert("Grupo editado exitosamente!")
        goBackAndGet()
      })
      .catch(error => {
          if (error.response.data.error.includes("Group not edited name exist, but schelude update")) {
            if (groupName == values.group) {
              alert("Grupo editado exitosamente!")
              goBackAndGet()
            } else {
              alert("¡Ya existe este grupo!\nIntente con un nombre de grupo nuevo...") 
            }
          } else {
            alert("Lo sentimos, se ha producido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.")
            console.log(error)
          }
      })
  }

  function addGroupSubmit() {
    axios
      .patch(`http://localhost:3030/api/subjects/creategroup/${user.email}/${subject.code}`, 
        {
          groups: [
            {
              name: values.group.toString(),
              students: [],
              schedule: values.schedules
            }
          ]
        }, 
        {
          headers: {
            Authorization: `Bearer ${user.tokenSession}`
          }
        }
      )
      .then(() => {
        alert("Grupo agregado exitosamente!")
        goBackAndGet()
      })
      .catch(error => {
        if (error.response.data.error == "The resource already exists") {
          alert("¡Ya existe este grupo! \n Intente con un grupo nuevo...") 
        } else {
          alert("Lo sentimos, se ha producido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.")
          console.log(error)
        }
      })
  }

  function editSubjectSubmit() {
    axios
      .patch(`http://localhost:3030/api/subjects/${user.email}/${subject.code}`, 
        {
          name: values.name
        }, 
        {
          headers: {
            Authorization: `Bearer ${user.tokenSession}`
          }
        }
      )
      .then(() => {
        alert("Asignatura editada exitosamente!")
        goBackAndGet()
      })
      .catch(error => {
        alert("Lo sentimos, se ha producido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.")
        console.log(error)
      })
  }

  function addSubjectSubmit() {
    axios
      .post(`http://localhost:3030/api/subjects/${user.email}`, 
        {
          code: values.code,
          name: values.name,
          groups: [
            {
              name: values.group.toString(),
              students: [],
              schedule: values.schedules
            }
          ]
        }, 
        {
          headers: {
            Authorization: `Bearer ${user.tokenSession}`
          }
        }
      )
      .then(() => {
        alert("Asignatura creada exitosamente!")
        goBackAndGet()
      })
      .catch(error => {
        if (error.response.data.error == "The resource already exists") {
          alert("¡Ya existe una asignatura con ese codigo!") 
        } else {
          alert("Lo sentimos, se ha producido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.")
        console.log(error)
        }
      })
  }

  return (
    <div className={`addSubject-box ${isEdit.includes("group") && "addSubject-box-group"}`}>
      <button className='addSubject-goBack' onClick={() => handlePassSubjects(false)}>
        <BsArrowLeft className='addSubject-goBack__icon' />
      </button>
      <div className='addSubject-content'>
        <form className='addSubject-form' onSubmit={(event) => handleSubmit(event)}>
          <h2 className='addSubject-form__label'>{title}</h2>
          <div className='addSubject-form__inputs'>
            <p>Nombre</p>
            <span className='addSubject-form__span'> </span>
            <input required autoComplete='off' disabled={handleEdit.name} name='name' className='first-child' type='text' onChange={(e) => handleInput(e)} value={values.name}/>
            <span className='addSubject-form__span'> </span>
            <p>Codigo</p>
            <p>Grupo</p>
            <input required autoComplete='off' disabled={handleEdit.code} name='code' type='text' onChange={(e) => handleInput(e)} value={values.code}/>
            <input required disabled={handleEdit.group} name='group' type='number' onChange={(e) => handleInput(e)} value={values.group}/>
          </div>
          <div className='addSubject-form__schedule'>
            <p className='addSubject__Schedule__label'>Horario</p>
            <div className='addSubject__schedule-grid'>
              {values.schedules.map((schedule, index) => {
                return <AddSubjectSchedule key={index} scheduleData={schedule} handleSetSchedule={handleSetSchedules} index={index} disable={handleEdit.schedules} />
              })}
              <div className='addSubject__schedule-buttons'>
              {values.schedules.length > 0 && 
                <button type='button' disabled={handleEdit.schedules} className={`addSubject-form__schedule-button ${handleEdit.schedules ?  "disabled-button" : ""}`} onClick={handleRemoveSchedule}><img src={minus} alt="remove"/></button>}
                <button type='button' disabled={handleEdit.schedules} className={`addSubject-form__schedule-button ${handleEdit.schedules ? "disabled-button" : ""}`} onClick={handleAddSchedule}><img src={plus} alt="add"/></button>
              </div>
            </div>
          </div>
          <div className='addSubject-form__buttons'>
            <button type='submit' disabled={handleEdit.submit} 
            className={` ${handleEdit.submit ? "disabled-button" : ""}`} >Aceptar</button>
            <button type='button' onClick={() => goBackAndGet()} disabled={handleEdit.submit} 
            className={` ${handleEdit.submit ? "disabled-button" : ""}`} >Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
