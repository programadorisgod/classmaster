import "./Styles/Styles.css";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { Navbar } from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import { Schedule } from "./Components/Schedule/Components/Schedule";
import CreateStudents from "./Components/CreateStudents/CreateStudents";
import { CompleteSetup } from "./Components/CompleteSetup/CompleteSetup";
import { ListStudents } from "./Components/ListStudents/ListStudents";
import { NotesStudents } from "./Components/NotesStudents/NotesStudents";
import { AttendanceStudents } from "./Components/AttendanceStudents/AttendanceStudents";
import { Subjects } from "./Components/SubjectManagement/Components/Subjects";
import { AccountSetup } from "./Components/AccountSetup/AccountSetup";
import { AttendanceNotification } from "./Components/Notification/AttendanceNotification";


const cookies = new Cookies();

export default  function Dashboard() {
  const [optionState, setOptionState] = useState("Horario");
  const [notifications, setNotifications] = useState([])
  const [user, setUser] = useState({
    id: "",
    avatar: null,
    name: "",
    email: cookies.get("email"),
    tokenSession: cookies.get("tokenSession"),
    rememberSession: cookies.get("rememberSession"),
    fullSetup: true,
  });
  const updateState = (newState) => {
    // definimos la función de actualización de estado del Sidebar
    setOptionState(newState);
  };

  function rememberSession() {
    cookies.remove("email", { path: "/" });
    cookies.remove("tokenSession", { path: "/" });
    cookies.remove("rememberSession", { path: "/" });
  };

  const handleAcceptNotification = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  const validation = () => {
    axios
      .get(
        `http://localhost:3030/api/users/${user.email}`,
        { headers: { Authorization: `Bearer ${user.tokenSession}` } }
      )
      .then((Response) => {
        user.rememberSession == "false" && rememberSession();
        const day = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][new Date().getDay()];

        setUser({
          ...user,
          id: Response.data._id,
          avatar: Response.data.avatar,
          name: Response.data.name,
          fullSetup: Response.data.fullSetup,
        });

        const newNotifications = Response.data.subjects.flatMap((sub, i) => {
          return sub.groups.flatMap((gro, j) => {
            return gro.schedule.map((sch, k) => {
              if (sch.day == day) {
                return ({id: `${i}${j}${k}`, subject: sub.name, group: gro.name, endTime: sch.endTime})
              } else {
                return null
              }
            })
            .filter(notification => notification !== null)
          })
        })
        
        setNotifications(newNotifications)
      })
      .catch((error) => {
        console.log(error)
        rememberSession();
        window.location.href = "./login";
      });
  };

  useEffect(() => {
    validation();
  }, []);

  function toggleAccountSetup(avatar = user.avatar, name = user.name) {
    setUser({ ...user, avatar: avatar, name: name, fullSetup: true });
  }

  const componentMap = {
    Horario: <Schedule user={user} />,
    "Ingresar Estudiantes": (<CreateStudents user={user} selected={optionState} />),
    "Lista de Estudiantes": <ListStudents user={user} />,
    Asistencia: <AttendanceStudents user={user} Option={optionState} />,
    Notas: <NotesStudents user={user} Option={optionState} />,
    Asignaturas: <Subjects user={user}/>,
    Cuenta: <AccountSetup user={user} toggleAccountSetup={toggleAccountSetup} updateState={updateState} />,
  };

  const Componente = componentMap[optionState] || componentMap["Horario"];

  return user.id == "" ? (
    <></>
  ) : (
    <div className="dashboard">
      <div className="notifications-box">
        {notifications.map((notification, index) => (
          <AttendanceNotification key={notification.id} subject={notification.subject} 
            group={notification.group} classEndTime={notification.endTime} 
            handleAcceptNotification={handleAcceptNotification} index={index} />
        ))}
      </div>
      {!user.fullSetup && (<CompleteSetup user={user} toggleFullSetup={toggleAccountSetup} />)}
      <Sidebar updateState={updateState} />
      <div className="dashboard__content">
        <Navbar user={user} title={optionState} updateState={updateState} signOff={rememberSession} />
        <div className="dashboard_component">{Componente}</div>
      </div>
    </div>
  );
}
