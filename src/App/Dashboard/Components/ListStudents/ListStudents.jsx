import axios from "axios";
import { useEffect, useState} from "react";
import ReactPaginate from 'react-paginate';
import { GoSearch } from "react-icons/go";
import { FaRegEdit, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IoTrash } from "react-icons/io5";
import profile from "../../../../Images/Default_pfp.svg.png";
import "./Styles.css";
import { ModalEdit } from "./ModalEdit";
import { Tooltip } from "../DataTable/Tooltip";
import { ListHeader } from "../ListHeader/ListHeader";
import SweetAlert from 'react-bootstrap-sweetalert';

export function ListStudents({ Option, user }) {
  const [data, setData] = useState({});
  const [students, setStudents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    avatar: profile,
    foto: profile,
    tipoid: "",
    id: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    email: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  
  const hideAlert = () => {
    setShowAlert(false);
  };
  const [studentsPerPage, setStudentsPerPage] = useState(getInitialStudentsPerPage());

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

  const handleEditStudent = (student) => {
    setFormData({
      avatar: student.avatar || profile,
      foto: profile,
      tipoid: student.typeId || "",
      id: student.identification || 0,
      nombre: student.name || "",
      apellido: student.lastName || "",
      telefono: student.phoneNumber || "",
      direccion: student.address || "",
      email: student.email || "",
    });
    setModalIsOpen(true);
  };

  const handleDeleteStudent = (studentId) => {
    const result = window.confirm(`¿Deseas eliminar el estudiante con N° de identificación: ${studentId}?`);
    if (result) {
      axios.delete(`http://localhost:3030/api/students/${user.email}/${data.subject}/${data.group}/${studentId}`,
        { headers: { Authorization: `Bearer ${user.tokenSession}` } })
        .then(() => {
          setShowAlert(true);
          data.subject !== undefined && data.group === "" ? getStudentSubject() : data.subject !== undefined && data.group !== "" ? getStudentsGroup() : getAllStudents();
        }).catch(() => {
          alert("Algo ha salido mal, intenta nuevamente.");
        });
    }
  };

  // Pagination
  const pageCount = Math.ceil(students.length / studentsPerPage);
  const offset = currentPage * studentsPerPage;
  const currentStudents = students.slice(offset, offset + studentsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="listStudents"> 
      <ListHeader setData={setData} Option={Option} user={user} />      
      <div className="search-container">
        <input type="text" className="input_search" placeholder="Buscar..." onChange={handleSearch} style={{width: "21vw"}}/>
        <GoSearch className="search-icon" />
      </div>
      <table className="DataTable">
        <thead>
          <tr>
            <th width={40} align="center">Foto</th>
            <th width={150} align="left">N° Identificación</th>
            <th width={400} align="left">Nombre completo</th>
            <th width={200}>Acciones <Tooltip /></th>
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
                      width={22}height={22}
                      style={{ borderRadius: "11px" }}
                      alt="Foto"

                    />
                  </td>
                  <td>{student.identification}</td>
                  <td>{student.name + " " + student.lastName}</td>
                  <td align="center">
                    
                      <button className="button edit" onClick={() => handleEditStudent(student)} disabled={data.group !== undefined && data.group !== "" && data.subject !== undefined && data.subject !== "" ? false : true}>
                        <FaRegEdit className="icon" /> Editar
                      </button>
                      <button className="button delete" onClick={() => handleDeleteStudent(student.identification)} disabled={data.group !== undefined && data.group !== "" && data.subject !== undefined && data.subject !== "" ? false : true}>
                        <IoTrash className="icon" /> Eliminar
                      </button>
                  </td>

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
          title="Eliminado correctamente!"
          onConfirm={hideAlert}
        />
      )}
      <ModalEdit formData={formData} modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} data={data} setFormData={setFormData} user={user} getStudentsGroup={getStudentsGroup} />
    </div>
  );
}