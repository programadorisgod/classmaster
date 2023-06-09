import { useState, useEffect } from "react";
import "./Styles.css";

export function Checkboxs({ attendance, student, onUpdateAttendance, date, actualDate, horario }) {
  const [newAttendance, setAttendance] = useState("");
  useEffect(() => {
    if (attendance === "" || attendance) {
      setAttendance(attendance || "");
    }
  }, [attendance,date]);

  const handleAttendanceChange = (value, student) => {
    setAttendance(value);
    onUpdateAttendance(value, student);
  };

  let isChecked = false;
  let isDisabled = false;

  if (date !== actualDate && date !== "") {
    isChecked = newAttendance !== "";
    isDisabled = false;
  } else if (date == actualDate) {
    isChecked = newAttendance !== "";
    isDisabled = !horario;
  } else if (date === "") {
    isDisabled = true;  
  }

  let asistencia = true;
  let falla = true;
  let excusa = true;

  if (date !== actualDate){
    if (newAttendance === "asistencia"){
      asistencia = false;
    } else if (newAttendance === "falla") {
      falla = false;
    } else if (newAttendance === "excusa"){
      excusa = false;
    }
  }
  if (date === actualDate || date !== ""){
    return (
      <td align="center">
        <input
          type="radio"
          className="radiobtn asistencia"
          name={`attendance-${student.identification}`}
          value="asistencia"
          checked={newAttendance === "asistencia" && isChecked && horario}
          disabled={date === actualDate?isDisabled:asistencia}
          onChange={() => handleAttendanceChange("asistencia", student)}
        />
        <input
          type="radio"
          className="radiobtn falla"
          name={`attendance-${student.identification}`}
          value="falla"
          checked={newAttendance === "falla" && isChecked}
          disabled={date === actualDate ? isDisabled : falla}
          onChange={() => handleAttendanceChange("falla", student)}
        />
        <input
          type="radio"
          className="radiobtn excusa"
          name={`attendance-${student.identification}`}
          value="excusa"
          checked={newAttendance === "excusa" && isChecked}
          disabled={date === actualDate ? isDisabled : excusa}
          onChange={() => handleAttendanceChange("excusa", student)}
        />
      </td>
    )
  }
  return (
    <td align="center">
      <input
        type="radio"
        className="radiobtn asistencia"
        disabled={isDisabled}
      />
      <input
        type="radio"
        className="radiobtn asistencia"
        disabled={isDisabled}
      />
      <input
        type="radio"
        className="radiobtn asistencia"
        disabled={isDisabled}
      />
    </td>
  );
}
