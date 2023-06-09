import axios from "axios";
import plus from "../../../../../Images/iconmonstr-plus-thin.svg";
import { BsArrowLeft } from 'react-icons/bs'
import { useState, useEffect } from "react";
import { Group } from "./Group";
import { AddSubject } from "./AddSubject";
import { DeleteInSubject } from "./DeleteInSubject";

export function Groups({ user, code, subject, handlePassSubjects, getSubjects }) {
  const [groupsList, setGroupsList] = useState(<></>)
  const [isDelete, setIsDelete] = useState(<></>)
  const [validation, setValidation] = useState(false)
  const [letPass, setLetPass] = useState({ state: false, element: <></> });

  const handlePassGroups = (state, element = <></>) => {
    setLetPass({state: state, element: element })
  }

  function getGroups() {
    axios
      .get(
        `https://server-classmaster-production.up.railway.app/api/subjects/${user.email}/${code}`,
        { headers: { Authorization: `Bearer ${user.tokenSession}` } }
      )
      .then((Response) => {
        const theGroups = Response.data[0].groups.map((gr) => (
          <Group key={gr._id} user={user} subject={subject} group={gr} handlePassGroups={handlePassGroups} getGroups={getGroups} />
        ));
        setGroupsList(theGroups);
      })
      .catch((error) => {
        console.log(error)
        alert("Lo sentimos, se ha producido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.")
      });
  };

  async function deleteSubject() {
    await axios.delete(
        `https://server-classmaster-production.up.railway.app/api/subjects/${user.email}/${code}`,
        {   headers: { Authorization: `Bearer ${user.tokenSession}` }   }
      )
      .then(() => {
        handlePassSubjects(false)
      })
      .catch((error) => {
        console.log(error)
        alert("Lo sentimos, se ha producido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.")
      });
  }

  const setState = (state) => {
    setValidation(state)
  }

  const cancel = () => {
    setIsDelete(<></>)
  }

  useEffect(() => {
    validation && deleteSubject()
  }, [validation])

  useEffect(() => {
    getGroups()
  }, []);

  return (
  <>
  {letPass.state ? letPass.element : 
  <div className="groups-box">
    {isDelete}
    <button className='addSubject-goBack' onClick={() => handlePassSubjects(false)}>
      <BsArrowLeft className='addSubject-goBack__icon' />
    </button>
    <div className="groups-content">
      <div className="subjects-content">
          {groupsList}
          <div
              className="addSubject"
              onClick={() =>
                {setLetPass({state: true, element: <AddSubject user={user} subject={subject} isEdit="addGroup" handlePassSubjects={handlePassGroups} getSubjects={getGroups} />})}
              }
          >
              <img src={plus} alt="plus" className="addSubject-icon" />
          </div>
      </div>
    </div>
    <div className='groups-content__buttons'>
      <button onClick={() => {setLetPass({state: true, element: <AddSubject user={user} subject={subject} isEdit="editSubject" handlePassSubjects={handlePassSubjects} getSubjects={getSubjects} />})}}>Editar</button>
      <button onClick={() => {setIsDelete(<DeleteInSubject user={user} setState={setState} cancel={cancel}/>)}}
      >Eliminar</button>
    </div>
  </div>
  }
  </>
  );
}
