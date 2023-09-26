import { AddSubject } from "./AddSubject";
import { DeleteInSubject } from "./DeleteInSubject";
import { useEffect, useState } from "react";
import axios from "axios";

export function HandleGroup({ user, subject, group, handlePassGroups, getGroups }) {
  const [handleEdit, setHandleEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(<></>)
  const [validation, setValidation] = useState(false)

  const setEdit = () => {
    setHandleEdit(!handleEdit)
  }

  const setState = (state) => {
    setValidation(state)
  }

  const cancel = () => {
    setIsDelete(<></>)
  }

  function deleteGroup() {
    axios.delete(
        `http://localhost:3030/api/subjects/deletegroup/${user.email}/${subject.code}/${group.name}`,
        {   headers: { Authorization: `Bearer ${user.tokenSession}` }   }
    ).then(() => {
        getGroups()
      handlePassGroups(false)
    })
  }

  useEffect(() => {
    validation && deleteGroup()
  },[validation])

  return (<>
    {isDelete}
    <div className="group-box"> 
    <AddSubject user={user} subject={{name: subject.name, code: subject.code, group: parseInt(group.name, 10), schedules: group.schedule}} isEdit={handleEdit ? "groupEdit":"group"} handlePassSubjects={handlePassGroups} getSubjects={getGroups} />
    <div className='groups-content__buttons'>
      <button disabled={handleEdit} className={handleEdit ? "disabled-button" : ""} onClick={() => {setEdit()}} >Editar</button>
      <button disabled={handleEdit} className={handleEdit ? "disabled-button" : ""} onClick={() => {setIsDelete(<DeleteInSubject user={user} setState={setState} cancel={cancel}/>)}} >Eliminar</button>
    </div>
  </div>
  </>
  );
}