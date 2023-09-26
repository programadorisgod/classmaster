import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import { GoSearch } from "react-icons/go";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import profile from "../../../../Images/Default_pfp.svg.png";
import "./Styles.css";
import { Tooltip } from "../DataTable/Tooltip";
import { ListHeader } from "../ListHeader/ListHeader";
import moment from 'moment';
import { Checkboxs } from "./Checkboxs"; 
import { FcExpired, FcDisapprove, FcApprove } from "react-icons/fc";
import SweetAlert from 'react-bootstrap-sweetalert';

export function AttendanceStudents({Option, user}) {
    const [data, setData] = useState({});
    const [search, setSearch] = useState('');
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [date, setDate] = useState("")
    const [showAlert, setShowAlert] = useState(false);
    const [correcto, setCorrect] = useState(false);
    const [studentsPerPage, setStudentsPerPage] = useState(getInitialStudentsPerPage());

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    //TRAE TODOS LOS ESTUDIANTES
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

    //TRAE LOS ESTUDIANTES DEPENDIENDO DE LA MATERIA
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
        setDate("");
    }, [data.subject]);

    //TRAE LOS ESTUDIANTES DEPENDIENDO DEL GRUPO
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
        setDate("");
    }, [data.group]);


    //VERIFICACIÓN DE HORARIO
    const hideAlert = () => {
        setShowAlert(false);
    };
    const originalDate = new Date();
    const actualDate = moment(originalDate).format('YYYY-MM-DD');
    function handleVerification() {        
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const actualDay = daysOfWeek[originalDate.getDay()];

        if (date === actualDate) {
            const horario = data.horario;
            horario.forEach((item) => {
                item.forEach((subItem) => {
                    if (subItem.day === actualDay) {
                        const currentTime = moment().format('HH:mm');
                        const startTime = moment(subItem.starTime, 'HH:mm');
                        const endTime = moment(subItem.endTime, 'HH:mm');
                        const isInTimeRange = moment(currentTime, 'HH:mm').isBetween(startTime, endTime, 'HH:mm');
                        if (isInTimeRange) {
                            setShowAlert(false);
                            setCorrect(true)
                        } else {
                            setShowAlert(true);
                        }
                    } else {
                        setShowAlert(true);
                    }
                });
            });
        }
    }

    //HISTORIAL DE ASISTENCIA POR FECHA
    async function getHistoryAttendance() {
        if (data.group !== "" && data.group !== undefined && date !== undefined) {
            try {
                const response = await axios.get(
                    `http://localhost:3030/api/students/Date/${user.email}/${data.subject}/${data.group}/${date.toString()}`,
                    { headers: { Authorization: `Bearer ${user.tokenSession}` } }
                );
                const history = response.data;
                history.map((student) => student.attendance.map((attendance) => {
                    const initialDate = attendance.date;
                    const convertedDate = moment.utc(initialDate).format('YYYY-MM-DD');
                    convertedDate === date ? handleAttendace(attendance.status, student) : ""}))
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }    
    }
    
    //REGISTRO DE ASISTENCIA
    function patchAttendance(studentId, attendance) {
        if (data.group !== "" && data.group !== undefined && date === actualDate) {
            return axios.patch(`http://localhost:3030/api/students/asistencia/${user.email}/${studentId}/${data.subject}/${data.group}`,
                    { attendance: [{ date: actualDate.toString(), status: attendance }] },
                    { headers: { Authorization: `Bearer ${user.tokenSession}` } }
                );
        }
    }
    const handleNewAttendance = () => {
        let successfulPatches = 0;

        if (date === actualDate) {
            const nonEmptyAttendances = Object.keys(attendance).filter(id => {
                const obj = attendance[id];
                const hasNonEmptyStatus = Object.values(obj).some(status => status !== "");
                return hasNonEmptyStatus;
            });

            const totalPatches = nonEmptyAttendances.length;

            nonEmptyAttendances.forEach(id => {
                const obj = attendance[id];
                Object.entries(obj).forEach(([status]) => {
                    if (obj[status] !== "") {
                        patchAttendance(id, obj[status])
                            .then(response => {
                                successfulPatches++;
                                if (successfulPatches === totalPatches) {
                                    setShowAlert(true);
                                    setAttendance("");
                                }
                            })
                            .catch(error => {
                                alert('Se produjo un error en al menos una asistencia, revisa nuevamente.');
                            });
                    }
                });
            });
        }
    };

    const handleAttendace = (value, student) => {
        if (data.subject !== undefined && data.group !== "" && data.group !== undefined) {
            if (student.attendance) {
                setAttendance(prevAttendance => {
                    const newAttendance = { ...prevAttendance };
                    newAttendance[student.identification] = {
                        ...newAttendance[student.identification],
                        status: value === "" ? "" : value
                    };
                    return newAttendance;
                });
            } else {
                setAttendance(prevAttendance => {
                    const newAttendance = { ...prevAttendance };
                    newAttendance[student.identification] = {
                        ...newAttendance[student.identification],
                        status: value === "" ? "" : value
                    };
                    return newAttendance;
                });
            }
        }
    }
    useEffect(() => {
        if(date===actualDate){
            if (students) {
                students.forEach((estudiante) => handleAttendace("asistencia", estudiante));
            }
        } else {
            if (students) {
                students.forEach((estudiante) => handleAttendace("", estudiante));
            }        
        }
       
    }, [students,date]);

    useEffect(() => {
        getHistoryAttendance();
        handleVerification();
    }, [date]);
    // PAGINACION
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

    const pageCount = Math.ceil(students.length / studentsPerPage);
    const offset = currentPage * studentsPerPage;
    const currentStudents = students.slice(offset, offset + studentsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (        
        <div className="listAttendance">
            <ListHeader setData={setData} Option={Option} user={user}/>
            <input type="date" className="input-date" value={date} onChange={(e)=>setDate(e.target.value)}/>
            <div className="search-container">
                <input type="text" className="input_search" placeholder="Buscar..." onChange={handleSearch} />
                <GoSearch className="search-icon" />
            </div>
            <table className="DataTable">
                <thead>
                    <tr>
                        <th width={40} align="center">Foto</th>
                        <th width={150} align="left">N° Identificación</th>
                        <th width={400} align="left">Nombre completo</th>
                        <th width={120} align="center">Acciones<Tooltip /><br /><label><FcApprove /><FcDisapprove/><FcExpired/></label></th>
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
                                <tr key={student.identification} >
                                    <td align="center">
                                        <img
                                            src={
                                                student.avatar ===
                                                    "http://localhost:3030/api/images/undefined"
                                                    ? profile
                                                    : student.avatar
                                            }
                                            width={22}
                                            style={{borderRadius: "11px"}}
                                            alt="Foto"
                                        />
                                    </td>
                                    <td>{student.identification}</td>
                                    <td>{student.name + " " + student.lastName}</td>
                                    <Checkboxs attendance={attendance [student.identification] &&attendance[student.identification].status} student={student} onUpdateAttendance={(value) =>
                                        handleAttendace(value, student) 
                                    } date={date} actualDate={actualDate} horario={correcto} />
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            {showAlert && (
                <SweetAlert
                    danger
                    title="Ups!"
                    show={showAlert}
                    onConfirm={hideAlert}
                >
                    No estás en el horario y/o día de este grupo de clase.
                </SweetAlert>
            )}
            {showAlert && attendance === "" &&(
                <SweetAlert
                    success
                    title="Lista de asistencia subida correctamente!"
                    onConfirm={hideAlert}
                />
            )}

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
            <button className="btn-attendance"onClick={handleNewAttendance}>Guardar asistencia</button>
        </div>
    );
}