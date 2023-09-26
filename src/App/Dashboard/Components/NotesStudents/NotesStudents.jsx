import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import { GoSearch } from "react-icons/go";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import profile from "../../../../Images/Default_pfp.svg.png";
import "../DataTable/Styles.css";
import "./Styles.css"
import { Notes } from "./Notes";
import { Tooltip } from "../DataTable/Tooltip";
import { ListHeader } from "../ListHeader/ListHeader";
import SweetAlert from 'react-bootstrap-sweetalert';

export function NotesStudents({ user }) {
    const [data, setData] = useState({});
    const [search, setSearch] = useState('');
    const [editNote, seteditNote] = useState({});
    const [students, setStudents] = useState([]);
    const [definitiva, setDefinitiva] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    const [estudiantes, setEstudiantes] = useState({
        "123": {
            0: "",
            1: "",
            2: "",
            definitiva:""
        }
    });
    const [studentsPerPage, setStudentsPerPage] = useState(getInitialStudentsPerPage());
    const [showAlert, setShowAlert] = useState(false);
    const hideAlert = () => {
        setShowAlert(false);
    };
    function getInitialStudentsPerPage() {
        return window.innerWidth > 1400 ? 14 : 7;
    }

    useEffect(() => {
        function handleResize() {
            setStudentsPerPage(getInitialStudentsPerPage());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    async function getAllStudents() {
        try {
            const response = await axios.get(
                `http://localhost:3030/api/students/${user.email}`,
                { headers: { Authorization: `Bearer ${user.tokenSession}` } }
            );
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        getAllStudents();
    }, []);

    async function getStudentSubject() {
        if (data.subject !== undefined && data.group !== undefined) {
            try {
                const response = await axios.get(
                    `http://localhost:3030/api/students/${user.email}/${data.subject}`,
                    { headers: { Authorization: `Bearer ${user.tokenSession}` } }
                );
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }
    };

    useEffect(() => {
        getStudentSubject();
        setCurrentPage(0);
    }, [data.subject]);

    async function getStudentsGroup() {
        if (data.group !== "" && data.group !== undefined) {
            try {
                const response = await axios.get(
                    `http://localhost:3030/api/students/${user.email}/${data.subject}/${data.group}`,
                    { headers: { Authorization: `Bearer ${user.tokenSession}` } }
                );
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }
    };

    useEffect(() => {
        getStudentsGroup();
        setCurrentPage(0);
    }, [data.group]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const handlePDF = () => {
        axios
            .get(
                `http://localhost:3030/api/students/archivo/exportarPDF/${user.email}/${data.subject}/${data.group}`,
                {
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/pdf',
                        Authorization: `Bearer ${user.tokenSession}`,
                    },
                }
            )
            .then((response) => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'estudiantes.pdf');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.error('Error al obtener el PDF:', error);
            });
    };

    useEffect(() => {
        if (students) {
            students.forEach((estudiante) => Nota(estudiante));
        }
    }, [students, currentPage]);

    function Nota(student) {
        if (data.subject !== undefined && data.group !== "" && data.group !== undefined) {
            const idMateria = Object.keys(student.notes)[0];
            if (idMateria) {
                setEstudiantes(prevEstudiantes => {
                    const nuevosEstudiantes = { ...prevEstudiantes };
                    nuevosEstudiantes[student.identification] = {
                        ...nuevosEstudiantes[student.identification],
                        0: student.notes[idMateria][0],
                        1: student.notes[idMateria][1],
                        2: student.notes[idMateria][2]
                    };
                    return nuevosEstudiantes;
                });
            } else {
                setEstudiantes(prevEstudiantes => {
                    const nuevosEstudiantes = { ...prevEstudiantes };
                    nuevosEstudiantes[student.identification] = {
                        0: 0,
                        1: 0,
                        2: 0
                    };
                    return nuevosEstudiantes;
                });
            }
        }
    }

    function handleNewNota(student, index, value) {
        if (
            data.subject !== undefined &&
            data.group !== "" &&
            data.group !== undefined
        ) {
            setEstudiantes((prevEstudiantes) => {
                const nuevosEstudiantes = { ...prevEstudiantes };
                nuevosEstudiantes[student.identification] = {
                    ...nuevosEstudiantes[student.identification],
                    [index]: parseFloat(value)
                };
                return nuevosEstudiantes;
            });

            seteditNote((prevNotes) => {
                const newNotes = { ...prevNotes };
                if (newNotes.hasOwnProperty(student.identification)) {
                    const studentNotes = { ...newNotes[student.identification] };
                    studentNotes[index] = parseFloat(value);
                    delete studentNotes[1 - index];
                    newNotes[student.identification] = studentNotes;
                } else {
                    newNotes[student.identification] = {
                        [index]: parseFloat(value)
                    };
                }

                return newNotes;
            });
        }
    }

    const patchNote = (studentId, value, index) => {
        return axios.patch(
            `http://localhost:3030/api/students/notes/${user.email}/${studentId}/${data.subject}/${data.group}`,
            { note: value, index: index },
            {
                headers: {
                    Authorization: `Bearer ${user.tokenSession}`,
                },
            }
        );
    };

    const handleNote = () => {
        const totalPatches = Object.keys(editNote).length;
        let successfulPatches = 0;

        Object.keys(editNote).forEach((id) => {
            const obj = editNote[id];
            Object.entries(obj).forEach(([index, value]) => {

                patchNote(id, value, index)
                    .then(response => {
                        // Patch exitoso
                        successfulPatches++;
                        if (successfulPatches === totalPatches) {
                            setShowAlert(true);
                        }
                    })
                    .catch(error => {
                        // Error en el parche
                        alert('Se produjo un error en al menos una nota, revisa nuevamente.');
                    });
            });
        });
    };
    // Pagination
    const pageCount = Math.ceil(students.length / studentsPerPage);
    const offset = currentPage * studentsPerPage;
    const currentStudents = students.slice(offset, offset + studentsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    function Definitiva(student,definitiva) {
        if (data.subject !== undefined && data.group !== "" && data.group !== undefined) {
            if (definitiva) {
                setEstudiantes((prevEstudiantes) => {
                    const nuevosEstudiantes = { ...prevEstudiantes };
                    nuevosEstudiantes[student.identification] = {
                        ...nuevosEstudiantes[student.identification],
                        ["definitiva"]: definitiva
                    };
                    return nuevosEstudiantes;
                });
            } else {
                setEstudiantes((prevEstudiantes) => {
                    const nuevosEstudiantes = { ...prevEstudiantes };
                    nuevosEstudiantes[student.identification] = {
                        ...nuevosEstudiantes[student.identification],
                        ["definitiva"]: 0
                    };
                    return nuevosEstudiantes;
                });
            }
        }
    }
    useEffect(()=>{},[definitiva])
    
    const style = (Id) => {
        if (estudiantes[Id] && estudiantes[Id].definitiva) {
           
            return {
                backgroundColor:
                    estudiantes[Id].definitiva <= 2.94 && estudiantes[Id].definitiva !== ""
                        ? "#ff0000bf"
                        : estudiantes[Id].definitiva > 2.94 &&
                            estudiantes[Id].definitiva < 4 &&
                            estudiantes[Id].definitiva !== ""
                            ? "#ffda0099"
                            : estudiantes[Id].definitiva === ""
                                ? ""
                                : "#00d8208f"
            };
        }
        return {}; 
    };
    return (
        <div className="noteStudents">
            <ListHeader setData={setData} Option={Option} user={user} />  
            <div className="search-container">
                <input type="text" className="input_search" style={{width: "21em"}} placeholder="Buscar..." onChange={handleSearch} />
                <GoSearch className="search-icon" />
            </div>
            <table className="DataTable">
                <thead>
                    <tr>
                        <th width={40} align="center">Foto</th>
                        <th width={150} align="left">N° Identificación</th>
                        <th width={400} align="left">Nombre completo</th>
                        <th width={200}>Acciones <Tooltip /><br/>1° 2° 3° / Cortes</th>
                    </tr>
                </thead>
                <tbody>
                    {currentStudents
                        .filter(student => {
                            const searchValue = search.toLowerCase();
                            return (
                                student.name.toLowerCase().includes(searchValue) ||
                                student.lastName.toLowerCase().includes(searchValue) ||
                                student.identification.toString().includes(searchValue)
                            );
                        })
                        .map(student => {
                            return (
                                <tr key={student.identification} style={style(student.identification)}>
                                    <td align="center">
                                        <img
                                            className="img-table-notes"
                                            src={
                                                student.avatar ===
                                                    "http://localhost:3030/api/images/undefined"
                                                    ? profile
                                                    : student.avatar
                                            }
                                            width={22}
                                            alt="Foto"
                                        />
                                    </td>
                                    <td>{student.identification}</td>
                                    <td>{student.name + " " + student.lastName}</td>
                                    <td align="center">
                                        <Notes student={estudiantes[student.identification]} data={data} onUpdateNote={(index, value) =>
                                            handleNewNota(student, index, value)
                                        } onUpdateDefinitiva={(definitiva)=>Definitiva(student, definitiva)} /></td>

                                </tr>
                            )
                        })}
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={<FaArrowLeft />}
                nextLabel={<FaArrowRight />}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                previousLinkClassName={'pagination__link'}
                nextLinkClassName={'pagination__link'}
                disabledClassName={'pagination__link--disabled'}
                activeClassName={'pagination__link--active'}
            />
            {showAlert && (
                <SweetAlert
                    success
                    title="Notas subidas correctamente!"
                    onConfirm={hideAlert}
                />
            )}
            <button className="btn btn-pdf" onClick={handlePDF}>Exportar PDF</button>
            <button className="btn btn-notes" onClick={handleNote}>Registrar notas</button>
        </div>
    );
}
