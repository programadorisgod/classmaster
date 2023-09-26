import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Validation } from "./Validation";
import axios from "axios";


export function Signin({ onFormSwitch }) {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordShown, setPasswordShown] = useState({
    password: false,
    confirm_password: false,
  });


  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      "email" in errors === false &&
      "password" in errors === false &&
      "confirm_password" in errors === false
    ) {
      signIn();
    }
  };

  function signIn() {
    axios
      .post(`https://serverclassmaster-mmh2-dev.fl0.io/api/auth/register`, {
        email: values.email,
        password: values.password,
      })
      .then(() => {
        setErrors({
          ...errors,
          validationError: false,
          class_confirm_password: "input_error_margin",
        });
      })
      .catch((error) => {
        if (error.response.data.error[0].msg == 'E-mail already in use') {
          setErrors({
            ...errors,
            validationError: true,
            class_confirm_password: "input_error_margin",
          });
        } else if (error.response.data.error[0].msg == "Invalid value") {
          alert(`${error.response.data.error[0].param} no valido`)
        }
        console.log(error);
      });
  }

  const handlePassword = () => {
    setErrors(Validation(values));
  }

  const handleEmail = () => {
    if (values.password !== "") {
      setErrors(Validation(values));
    } else {
      const obj = Validation(values);
      delete obj.password;
      delete obj.class_password;
      setErrors(obj);
    }
  }

  const handlePasswordError = () => {
    if (errors.password) {
      return (
        <p className={`input__error ${errors.password.length > 31 ? "text-aling-center" : ""}`}>
          {errors.password}
        </p>
      )
    }
  }

  const handlePasswordIcon = () => {
    if (values.password !== "") {
      if (passwordShown.password) {
        return (<FontAwesomeIcon
          icon={faEyeSlash}
          className="input-box__font-icon cursor_pointer"
          onClick={() =>
            setPasswordShown({
              ...passwordShown,
              password: !passwordShown.password,
            })
          }
        />)
      } else {
        return (
          <FontAwesomeIcon
            icon={faEye}
            className="input-box__font-icon cursor_pointer"
            onClick={() =>
              setPasswordShown({
                ...passwordShown,
                password: !passwordShown.password,
              })
            }
          />)
      }
    } else {
      return (<FontAwesomeIcon icon={faLock} className="input-box__font-icon" />)
    }
  }

  const handleConfirmPasswordIcon = () => {
    if (values.confirm_password !== "") {
      if (passwordShown.confirm_password) {
        return (<FontAwesomeIcon
          icon={faEyeSlash}
          className="input-box__font-icon cursor_pointer"
          onClick={() =>
            setPasswordShown({
              ...passwordShown,
              confirm_password: !passwordShown.confirm_password,
            })
          }
        />)
      } else {
        return (<FontAwesomeIcon
          icon={faEye}
          className="input-box__font-icon cursor_pointer"
          onClick={() =>
            setPasswordShown({
              ...passwordShown,
              confirm_password: !passwordShown.confirm_password,
            })
          }
        />)
      }
    } else {
      return (<FontAwesomeIcon icon={faLock} className="input-box__font-icon" />)
    }
  }

  const handleConfirmPasswordError = () => {
    if (errors.confirm_password) {
      return (<p className="input__error">{errors.confirm_password}</p>)
    } else {
      if (errors.validationError) {
        return (<p className="input__validation-error">
          La cuenta ya existe. Intente con  <br />  otra dirección de correo...
        </p>)
      } else if (errors.validationError == false) {
        return (<p className="input__validation-successful">
          La cuenta se ha registrado correctamente. <br/> ¡Inicie sesión para comenzar!
        </p>)
      }
    }
  }


  return (
    <div className="access-box form-box">
      <form onSubmit={handleSubmit}>
        <h2 className="form__title">Registrarse</h2>
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
            type={passwordShown.password ? "text" : "password"}
            className="input-box__input"
            placeholder=" "
            onChange={handleInput}
            onBlur={handlePassword}
            required
          />
          <label className="input-box__label">Contraseña</label>
        </div>

        { handlePasswordError() }

        <div className={`form__input-box ${errors.class_confirm_password ? errors.class_confirm_password : ""}`} >
          { handleConfirmPasswordIcon() }
          <input
            name="confirm_password"
            type={passwordShown.confirm_password ? "text" : "password"}
            className="input-box__input"
            placeholder=" "
            onChange={handleInput}
            onBlur={handlePassword}
            required
          />
          <label className="input-box__label">Confirmar contraseña</label>
        </div>

        { handleConfirmPasswordError() }

        <button  className="form__button cursor_pointer">Crear cuenta</button>
        <div className="form__register">
          <span>
            {"¿Ya tienes una cuenta? "}
            <span
              onClick={() => onFormSwitch("Login")}
              className="register__link cursor_pointer"
            >
              Iniciar sesión
            </span>
          </span>
        </div>
      </form>
    </div>
  );
}
