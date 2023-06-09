import { useState, useEffect } from 'react';
import "./Styles.css";

export function AttendanceNotification({ subject, group, classEndTime, handleAcceptNotification, index }) {
  const [hours, minutes] = classEndTime.split(':').map(Number);
  const classEndTimeDate = new Date().setHours(hours, minutes, 0, 0);
  const timeLeftInMinutes = Math.floor((classEndTimeDate - Date.now()) / (60 * 1000));
  const [timeLeft, setTimeLeft] = useState(timeLeftInMinutes);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft => timeLeft - 1);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleNotification = () => {
    if (timeLeft <= 20 && timeLeft >= 0) {
      return(
        <div className='notification'>
          <h4>{subject}</h4>
          <h5>Grupo: {group}</h5>
          <p>
            <span>Tiempo restante para tomar asistencia:</span>
            <span>{`${timeLeft} minutos`}</span>
          </p>
          <button onClick={() => {handleAcceptNotification(index)}}>Aceptar</button>
        </div>
        )
    } else {
      return(<></>)
    }
  }

  return (<>{handleNotification()}</>)
}