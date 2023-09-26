import "../Styles.css";
import logoClassMaster from "../../../../../Images/Logo.png"
import emptyIcon from "../../../../../Images/caja-vacia.png"
import { SubjectSchedule } from "./SubjectSchedule";
import axios from "axios";
import { useEffect, useState } from "react";

export function Schedule({user}) {
  const [subjects, setSubjects] = useState([])
  const [hidden, setHidden] = useState(true);


  function getSubjects() {
    axios
      .get(
        `http://localhost:3030/api/subjects/${user.email}`,
        { headers: { Authorization: `Bearer ${user.tokenSession}` } }
      )
      .then((Response) => {
        const list = Response.data.map((sub) => (
          <SubjectSchedule key={sub._id} subject={sub}/>
        ))
        setSubjects(list)
      })
      .catch((error) => {
        alert("Lo sentimos, se ha producido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.")
        console.log(error)
      });
  };

  useEffect(() => {
    getSubjects()
    setInterval(() => {
      setHidden(false);
    }, 600);
  },[])

  return (
    <div className="schedule-box">
      <div className={`schedule-content ${hidden ? 'hidden' : ''}`}>
        <div className="cover"></div>
        <div className="schedule-headers">
          <div className="schedule-header"><img src={logoClassMaster} alt="Logo" className="schedule-header-logo"/></div>
          <div className="schedule-header"><h2>Lunes</h2></div>
          <div className="schedule-header"><h2>Martes</h2></div>
          <div className="schedule-header"><h2>Miércoles</h2></div>
          <div className="schedule-header"><h2>Jueves</h2></div>
          <div className="schedule-header"><h2>Viernes</h2></div>
          <div className="schedule-header"><h2>Sábado</h2></div>
          <div className="schedule-header"><h2>Domingo</h2></div>
        </div>
        <div className="schedule">
          {subjects.length > 0 ? subjects : 
          <div className="schedule-empty-box">
            <div className="schedule-empty">
              <h2 className="schedule-empty__title">El horario esta vacio... Agregue algunas asignaturas.</h2>
              <div className="schedule-empty__icon"><img src={emptyIcon} alt="vacio" /></div>
            </div> 
          </div>}
        </div>
      </div>
    </div>
  );
}
