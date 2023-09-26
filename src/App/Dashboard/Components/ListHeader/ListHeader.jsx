import { useState, useEffect } from "react";
import axios from "axios";
import "./Styles.css"

export function ListHeader({user, setData}) {
    const [groupNames, setGroupNames] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(""); 
    const [selectedGroup, setSelectedGroup] = useState(""); 
    const [selectedHorario, setHorario] = useState(""); 
    useEffect(() => {
        if (selectedSubject !== "" && selectedSubject !== undefined) {
            setData({
                subject: selectedSubject,
                group: selectedGroup,
                horario: selectedHorario
            });
        }
    }, [selectedSubject, selectedGroup, selectedHorario]);

    useEffect(() => {        
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3030/api/subjects/${user.email}`,
                    { headers: { Authorization: `Bearer ${user.tokenSession}` } }
                );
                setSubjects(response.data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        fetchSubjects();
    }, []);

    useEffect(() => {
        // Buscar la asignatura seleccionada en la lista de asignaturas
        const selectedSubjectData = subjects.find(
            (subject) => subject.name === selectedSubject
        );
        
        if (selectedSubjectData && selectedSubjectData.groups) {
            setGroupNames(selectedSubjectData.groups.map((group) => group.name));
            setSelectedGroup("");
        }
    }, [selectedSubject]);

    useEffect(() => {
        // Buscar la asignatura seleccionada en la lista de asignaturas
        const selectedSubjectData = subjects.find(
            (subject) => subject.name === selectedSubject
        );

        if (selectedSubjectData && selectedSubjectData.groups) {
            const filteredGroups = selectedSubjectData.groups
                .filter((group) => group.name === selectedGroup)
                .map((group) => group.schedule);

            setHorario(filteredGroups);
        }
    }, [selectedGroup]);


    

    return (
        <div className="ListHeader">
            <label>
                <strong>Asignatura</strong>
            </label>
            <select
                className="select selected"
                value={selectedSubject}
                name="asignatura"
                onChange={(event) => setSelectedSubject(event.target.value)}
            >
                <option></option>
                {subjects.map((subject) => (
                    <option key={subject._id}>{subject.name}</option>
                ))}
            </select>
            <label>
                <strong>Grupo</strong>
            </label>
            <select className="select selected" value={selectedGroup} name="grupo" 
            onChange={(event) => setSelectedGroup(event.target.value)}>
                <option></option>
                {groupNames.map((group) => (
                    <option key={group}>{group}</option>
                ))}
            </select>
        </div>
    );
}
