import "./Styles.css";
import userDefault from "../../../../Images/Default_pfp.svg.png";
import { BsArrowLeft } from 'react-icons/bs'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { DeleteInSubject } from "../SubjectManagement/Components/DeleteInSubject";
import { useState, useEffect } from "react";
import axios from "axios";

export function AccountSetup({user, toggleAccountSetup, updateState}) {
    const [isDelete, setIsDelete] = useState(<></>)
    const [deleteAccount, setDeleteAccount] = useState(false)
    const [isEditPassword, setIsEditPassword] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [typeSubmit, setTypeSubmit] = useState(false)
    const [passwordShown, setPasswordShown] = useState({
        password: false,
        confirmPassword: false})
    const [values, setValues] = useState({
        avatar: userDefault,
        name: "",
        lastName: "",
        phoneNumber: "",
        identification: "",
        address: "",
        password: "",
        confirmPassword: ""
    })

    useEffect(() => {
        const fetchingData = () => {
          axios
            .get(
              `https://serverclassmaster-mmh2-dev.fl0.io/api/users/${user.email}`,
              { headers: { Authorization: `Bearer ${user.tokenSession}` } }
            )
            .then((Response) => {
              setValues({...values,
                avatar: Response.data.avatar,
                name: Response.data.name,
                lastName: Response.data.lastName,
                phoneNumber: Response.data.phoneNumber,
                identification: Response.data.identification,
                address: Response.data.address,
                password: Response.data.password,
                fullSetup: Response.data.fullSetup
              });
            })
            .catch((error) => {
              console.log("Error fetching user data\n" + error);
            });
        };
        fetchingData();
    }, [isEdit]);

    useEffect(() => {
        if (deleteAccount) {
            axios.delete(`https://serverclassmaster-mmh2-dev.fl0.io/api/users/${user.email}`,
            { headers: { Authorization: `Bearer ${user.tokenSession}` } })
            .then(() => {
                window.location.href = "./login"
            })
            .catch((error) => {
                console.log(error)
                alert("Lo sentimos, se ha producido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.")
            });
        }
    }, [deleteAccount])

    useEffect(() => {
        if (isEdit) {
            setTypeSubmit(true)
        } else {
            setTypeSubmit(false)
        }
    }, [isEdit])

    useEffect(() => {
        isEditPassword && setValues({...values, password: "", confirmPassword: ""})
    }, [isEditPassword])

    const handleInput = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        if (file.type.includes("image")) {
          try {
            reader.onload = () => {
              setValues({ ...values, avatar: reader.result, avatarFile: file});
            };
            reader.readAsDataURL(file);
          } catch (error) {
            console.log("Error uploading image \n" + error);
          }
        }
    };

    const submit = (e) => {
        e.preventDefault();
        let validation = ""

        validation = isEditPassword && passwordValidation(values.password, values.confirmPassword)

        if (validation == "") {
            const formData = valuesValidation(values);
            isEditPassword && formData.append("password", values.password)
    
            axios
                .patch(
                `https://serverclassmaster-mmh2-dev.fl0.io/api/users/${user.email}`,
                formData,
                {
                    headers: {
                    Authorization: `Bearer ${user.tokenSession}`,
                    "Content-Type": "multipart/form-data",
                    },
                }
                )
                .then(() => {
                    alert("Cuenta editada exitosamente!")
                    toggleAccountSetup(values.avatar, values.name)
                    setIsEdit(prevState => !prevState);
                    isEditPassword && setIsEditPassword(!isEditPassword)
                })
                .catch((error) => {
                    console.log(error)
                    alert("Lo sentimos, se ha producido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.")
                })
        } else {
            alert(validation)
        }
    }

    const handleEditButton = () => {
        if (isEdit) {
            return(<button type={typeSubmit ? "submit" : "button"} className="configuration-button__submit"
                >Aceptar</button>)
        } else {
            return(<button type="button" className="configuration-button__edit"
                    onClick={() => {
                        setIsEdit(prevState => !prevState);
                    }}
                >Editar</button>)
        }
    }

    const handleDeleteButton = () => {
        if (isEdit) {
            return(<button type="button" className="configuration-button__delete" 
                    onClick={() => {
                        setIsEdit(prevState => !prevState);
                        isEditPassword && setIsEditPassword(!isEditPassword)
                    }}
                >Cancelar</button>)
        } else {
            return(<button type="button" className="configuration-button__delete"
                    onClick={() => {
                        setIsDelete(<DeleteInSubject user={user} setState={handleDelete} cancel={cancel} />)
                    }}
            >Eliminar Cuenta</button>)
        }
    }

    const handleDelete = (state) => {
        setDeleteAccount(state)
    }

    const handleEditPassword = (state) => {
        setIsEditPassword(state)
    }

    const cancel = () => {
        setIsDelete(<></>)
    }

    const handlePasswordButton = () => {
        if (!isEditPassword) {
            return(<button type="button" disabled={!isEdit} 
                    onClick={() => {
                        setIsDelete(<DeleteInSubject user={user} setState={handleEditPassword} cancel={cancel} title="Verificación"/>)
                    }}
                    className={`configuration-input__password-button ${!isEdit ? "disabled-button" : ""}`}
                >Cambiar contraseña</button>)
        } else {
            return(<>
                <h4> Confirmar <br/> Contraseña</h4>
                <input name="confirmPassword" type={passwordShown.confirmPassword ? "text" : "password"} id="configuration-input__confirm-password" 
                value={values.confirmPassword} onChange={handleInput} />
            </>)
        }
    }

    const handlePasswordIcon = () => {
        if (values.password !== "" && isEditPassword) {
          if (passwordShown.password) {
            return (<FontAwesomeIcon
              icon={faEyeSlash}
              className="configuration-input__password-icon cursor_pointer"
              onClick={() =>
                setPasswordShown({
                  ...passwordShown,
                  password: !passwordShown.password,
                })
              }
            />)
          } else if (isEditPassword) {
            return (
              <FontAwesomeIcon
                icon={faEye}
                className="configuration-input__password-icon cursor_pointer"
                onClick={() =>
                  setPasswordShown({
                    ...passwordShown,
                    password: !passwordShown.password,
                  })
                }
              />)
          }
        } else {
          return (<FontAwesomeIcon icon={faLock} className="configuration-input__password-icon" />)
        }
      }
    
      const handleConfirmPasswordIcon = () => {
        if (values.confirmPassword !== "" && isEditPassword) {
          if (passwordShown.confirmPassword) {
            return (<FontAwesomeIcon
              icon={faEyeSlash}
              className="configuration-input__password-icon cursor_pointer"
              onClick={() =>
                setPasswordShown({
                  ...passwordShown,
                  confirmPassword: !passwordShown.confirmPassword,
                })
              }
            />)
          } else if (isEditPassword) {
            return (<FontAwesomeIcon
              icon={faEye}
              className="configuration-input__password-icon cursor_pointer"
              onClick={() =>
                setPasswordShown({
                  ...passwordShown,
                  confirmPassword: !passwordShown.confirmPassword,
                })
              }
            />)
          }
        } else {
          return (<FontAwesomeIcon icon={faLock} className="configuration-input__password-icon" />)
        }
      }

    return(
        <div className="configuration-box">
            {isDelete}
            <button className='addSubject-goBack configuration-goBack' onClick={() => updateState("Horario")}>
                <BsArrowLeft className='addSubject-goBack__icon' />
            </button>
            <form className="configuration-content" onSubmit={(e) => {submit(e)}}>
                <div className="configuration-profile-img configuration-content__child">
                    <div className="configuration-profile__img-box">
                        <input type="file" disabled={!isEdit} onChange={handleFile}
                        className={`configuration-profile__img ${!isEdit ? "disabled-button" : "" }`} />
                        <img src={values.avatar} alt="profile-img" className="configuration-profile__img" />
                    </div>
                </div>
                <div className="configuration-inputs-profile configuration-content__child">
                    <div className="configuration-input__twice">
                        <h4>Nombre</h4>
                        <input name="name" type="text" value={values.name} disabled={!isEdit} onChange={handleInput} />
                    </div>
                    <div className="configuration-input__twice">
                        <h4>Apellido</h4>
                        <input name="lastName" type="text" value={values.lastName} disabled={!isEdit} onChange={handleInput} />
                    </div>
                </div>
                <div className="configuration-inputs-profile configuration-content__child">
                    <div className="configuration-input__twice">
                        <h4>Telefono</h4>
                        <input name="phoneNumber" type="number" value={values.phoneNumber} disabled={!isEdit} onChange={handleInput} />
                    </div>
                    <div className="configuration-input__twice">
                        <h4 id="configuration-identification">Identificación</h4>
                        <input name="identification" type="number" value={values.identification} disabled={!isEdit} onChange={handleInput} />
                    </div>
                </div>
                <div className="configuration-inputs-profile configuration-content__child">
                    <div className="configuration-input__twice">
                        <h4>Dirección</h4>
                    </div>
                    <div className="configuration-input__twice">
                        <input name="address" type="text" id="configuration-address-input" value={values.address} 
                        disabled={!isEdit} onChange={handleInput} />
                    </div>
                </div>
                <div className="configuration-inputs-profile configuration-content__child">
                    <div className="configuration-input__twice">
                        <h4>Contraseña</h4>
                        <input name="password" type={passwordShown.password ? "text" : "password"} 
                        id="configuration-input__password" value={values.password} disabled={!isEditPassword} 
                        onChange={handleInput} />
                        {handlePasswordIcon()}
                    </div>
                    <div className="configuration-input__twice">
                        { handlePasswordButton() }
                        { isEditPassword && handleConfirmPasswordIcon() }
                    </div>
                </div>
                <div className="configuration-inputs-profile">
                    <div className="configuration-input__twice">
                        { handleEditButton() }
                    </div>
                    <div className="configuration-input__twice">
                        { handleDeleteButton() }
                    </div>
                </div>
            </form>
        </div>
    )
}

function valuesValidation(values) {
    const formData = new FormData();
    let count = 0;
  
    if (!values.avatar.includes("1684610855346-userdefault.jpg")) {
        values.avatarFile && formData.append("avatar", values.avatarFile)
        count++
    }
    if (values.name != "" ) {
      formData.append("name", values.name)
      count++
    }
    if (values.last_name != "") {
      formData.append("lastName", values.lastName)
      count++
    }
    if (values.phone_number != "" && values.phoneNumber.length > 6) {
      formData.append("phoneNumber", values.phoneNumber);
      count++
    }
    if (values.identification != "" && values.identification.length > 6) {
      formData.append("identification", values.identification)
      count++
    }
    if (values.address != "") {
      formData.append("address", values.address)
    }
    count > 4 && formData.append("fullSetup", true)
  
    return formData
}

function passwordValidation(password, confirmPassword) {
    const passwordPattern = /^.{8,}$/

    if ( password === "" ) {
        return "Contraseña vacia, esta no sera modificada..."
    } else {
        if ( !passwordPattern.test(password) ) {
            return "La contraseña debe tener al menos 8 caracteres"
        }   
    }
    
    if ( confirmPassword != password ) {
        return "Las contraseñas no coinciden"
    }

    return ""
}