import { useState } from "react";
import { Validation } from "./Validation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "universal-cookie";


const cookies = new Cookies();

export function Login({ onFormSwitch }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
    rememberSession: false
  })
  const [errors, setErrors] = useState({})
  const [passwordShown, setPasswordShown] = useState(false)


  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if ("email" in errors === false && "password" in errors === false) {
      logIn()
    }
  }

 function logIn() {
    axios
      .post("https://server-classmaster-production.up.railway.app/api/auth/login",
       { email: values.email, password: values.password })
      .then(response => {
        response = response.data
        cookies.set("email", response.user.email, { path: "/" })
        cookies.set("tokenSession", response.tokenSession, { path: "/" })
        cookies.set("rememberSession", values.rememberSession, { path: "/" })
        window.location.href = "./app"
      })
      .catch(error => {
        setErrors({
          ...errors,
          validationError: true,
          class_password: "input_error_margin",
        })
        console.log(error)
      })
  }

  const handlePassword = () => {
    setErrors(Validation(values))
  }

  const handleEmail = () => {
    if (values.password !== "") {
      setErrors(Validation(values))
    } else {
      const obj = Validation(values)
      delete obj.password
      delete obj.class_password
      setErrors(obj)
    }
  }

  const handlePasswordIcon = () => {
    if (values.password !== "") {
      if (passwordShown) {
        return (<FontAwesomeIcon
          icon={faEyeSlash}
          className="input-box__font-icon cursor_pointer"
          onClick={() =>
            setPasswordShown(!passwordShown)
          }
        />)
      } else {
        return (
          <FontAwesomeIcon
            icon={faEye}
            className="input-box__font-icon cursor_pointer"
            onClick={() =>
              setPasswordShown(!passwordShown.password)
            }
          />)
      }
    } else {
      return (<FontAwesomeIcon icon={faLock} className="input-box__font-icon" />)
    }
  }

  const handlePasswordError = () => {
    if (errors.password) {
      return (
        <p className={`input__error ${errors.password.length > 31 ? "text-aling-center" : ""}`}>
          {errors.password}
        </p>
      )
    } else if (errors.validationError) {
      return (<p className="input__validation-error">
        Cuenta no encontrada. Intente <br /> nuevamente o regístrese...
      </p>)
    }
  }


  return (
    <div className="access-box form-box"> 
      <form onSubmit={handleSubmit}>
        <h2 className="form__title">Iniciar sesión</h2>
        <div className={`form__input-box ${errors.class_email ? errors.class_email : ""}`} >
          <FontAwesomeIcon icon={faEnvelope} className="input-box__font-icon" />
          <input
            name="email"
            type="email"
            className="input-box__input"
            placeholder=" "
            onChange={handleInput}
            onBlur={handleEmail}
            autoComplete="off"
            required
          />
          <label className="input-box__label">Correo</label>
        </div>

        {errors.email && <p className="input__error">{errors.email}</p>}

        <div className={`form__input-box ${errors.class_password ? errors.class_password : ""}`} >
          { handlePasswordIcon() }
          <input
            name="password"
            type={passwordShown ? "text" : "password"}
            className="input-box__input"
            placeholder=" "
            onChange={handleInput}
            onBlur={handlePassword}
            required
          />
          <label className="input-box__label">Contraseña</label>
        </div>

        { handlePasswordError() }

        <div className="form__forget">
          <input
            type="checkbox"
            onChange={() =>
              setValues({ ...values, rememberSession: !values.rememberSession })
            }
            className="forget__input"
          />
          <span>{"Recuerdame "}</span>
        </div>

        <button type="submit" className="form__button cursor_pointer">
          Ingresar
        </button>
        <div className="form__register">
          <span>
            {"¿No tienes una cuenta? "}
            <span
              onClick={() => onFormSwitch("Register")}
              className="register__link cursor_pointer"
            >
              Registrate
            </span>
          </span>
        </div>
      </form>
    </div>
  );
}
