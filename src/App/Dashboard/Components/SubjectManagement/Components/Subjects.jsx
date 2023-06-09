import "../Styles.css";
import axios from "axios";
import plus from "../../../../../Images/iconmonstr-plus-thin.svg";
import { useState, useEffect } from "react";
import { Subject } from "./Subject";
import { AddSubject } from "./AddSubject";

export function Subjects({ user }) {
  const [subjectsList, setSubjectsList] = useState(<></>);
  const [letPass, setLetPass] = useState({ state: false, element: <></> });

  const handlePass = (state, element = <></>) => {
    setLetPass({ state: state, element: element });
  };

  function getSubjects() {
    axios
      .get(
        `https://server-classmaster-production.up.railway.app/api/subjects/${user.email}`,
        { headers: { Authorization: `Bearer ${user.tokenSession}` } }
      )
      .then((Response) => {
        const theSubjects = Response.data.map((sub) => (
          <Subject key={sub._id} user={user} subject={sub} handlePassSubjects={handlePass} getSubjects={getSubjects} />
        ));
        setSubjectsList(theSubjects);
      })
      .catch((error) => {
        console.log(error)
        alert("Lo sentimos, se ha producido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.")
      });
  };

  useEffect(() => {
    getSubjects()
  }, [letPass]);

  return (
    <div className="subjects-box">
      {letPass.state ? letPass.element : 
      <div className="subjects-content">
        {subjectsList}
        <div
          className="addSubject"
          onClick={() =>
            handlePass(true, <AddSubject user={user} handlePassSubjects={handlePass} getSubjects={getSubjects}/>)
          }
        >
          <img src={plus} alt="plus" className="addSubject-icon" />
        </div>
      </div>}
    </div>
  );
}
