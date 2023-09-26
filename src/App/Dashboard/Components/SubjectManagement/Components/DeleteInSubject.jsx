import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export function DeleteInSubject({user, setState, cancel, title = "Confirmar eliminación"}) {
    const [values, setValues] = useState({
        password: "", 
        confirmPassword: "", 
        passwordShown: false, 
        confirmPasswordShown: false, 
        passwordError: "", 
        confirmPasswordError: ""
    })

    const handleInput = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }

    const submit = async (e) => {
        e.preventDefault()
        if (values.passwordError == "" && values.confirmPasswordError == "") {
            await axios
            .post("http://localhost:3030/api/auth/login", { email: user.email, password: values.password })
            .then(response => {
                if (response.data.user._id == user.id) {
                    setState(true)
                    cancel()
                }
            })
            .catch(error => {
                alert("Contraseña incorrecta!")
                console.log(error)
            });
        }
    }

    const onBlurPasswordInput = () => {
        const error = validation(values.password, values.confirmPassword)
        error.password != undefined && setValues({...values, passwordError: error.password})
    }

    const onBlurConfirmPasswordInput = () => {
        const error = validation(values.password, values.confirmPassword)
        error.confirmPassword != undefined && setValues({...values, confirmPasswordError: error.confirmPassword})
    }

    const setIconPassword = () => {
        if (values.password != "") {
            if (values.passwordShown) {
                return <FontAwesomeIcon icon={faEyeSlash} className="delete-input__font-icon" onClick={() => {setValues({...values, passwordShown: !values.passwordShown})}} />
            } else {
                return <FontAwesomeIcon icon={faEye} className="delete-input__font-icon" onClick={() => {setValues({...values, passwordShown: !values.passwordShown})}} />
            }
        } else {
            return <FontAwesomeIcon icon={faLock} className="delete-input__icon" />
        }
    }

    const setIconConfirmPassword = () => {
        if (values.confirmPassword != "") {
            if (values.confirmPasswordShown) {
                return <FontAwesomeIcon icon={faEyeSlash} className="delete-input__font-icon" onClick={() => {setValues({...values, confirmPasswordShown: !values.confirmPasswordShown})}} />
            } else {
                return <FontAwesomeIcon icon={faEye} className="delete-input__font-icon" onClick={() => {setValues({...values, confirmPasswordShown: !values.confirmPasswordShown})}} />
            }
        } else {
            return <FontAwesomeIcon icon={faLock} className="delete-input__icon" />
        }
    }

    const passwordInputError = () => {
        if (values.passwordError != "" && values.passwordError != undefined) {
            return <p className="delete-input__error">{values.passwordError}</p>
        } else {
            return <></>
        }
    }

    const confirmPasswordInputError = () => {
        if (values.confirmPasswordError != "" && values.confirmPasswordError != undefined) {
            return <p className="delete-input__error">{values.confirmPasswordError}</p>
        } else {
            return <></>
        }
    }
    
    return(<div className="delete-box">
        <form className="delete-form" onSubmit={submit}>
            <h3 className="delete__label">{title}</h3>
            <div className="delete-input-box">

                <input required name="password" id="password" type={values.passwordShown ? "text" : "password"} className="delete-input__input" placeholder="Contraseña" onChange={handleInput} onBlur={() => { onBlurPasswordInput() }} value={values.password} />
                {setIconPassword()}

            </div>

            {passwordInputError()}

            <div className="delete-input-box">

                <input required name="confirmPassword" type={values.confirmPasswordShown ? "text" : "password"} className="delete-input__input" placeholder="Confirmar contraseña" onChange={handleInput} onBlur={() => { onBlurConfirmPasswordInput() }} value={values.confirmPassword} />
                {setIconConfirmPassword()}

            </div>

            {confirmPasswordInputError()}

            <div className="delete-buttons-box">
                <button type="submit" className="delete__button" id="delete__button" >Aceptar</button>
                <button type="button" className="delete__button" onClick={() => {cancel()}} >Cancelar</button>
            </div>
        </form>
    </div>)
}

function validation(password, confirm_password) {
    const passwordPattern = /^.{8,}$/
    let error = {}

    if ( password === "" ) {
        error.password = "La contraseña no debe estar vacia"
    } else {
        if ( !passwordPattern.test(password) ) {
            error.password = "La contraseña debe tener al menos 8 caracteres"
        } else {
            error.password = ""
        }    
    }
    
    if ( confirm_password != password ) {
        error.confirmPassword = "Contraseñas no coinciden"
    } else {
        error.confirmPassword = ""
    }
    return error
}