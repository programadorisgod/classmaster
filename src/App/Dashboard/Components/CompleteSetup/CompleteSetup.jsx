import ".//Styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import addAvatar from "../../../../Images/user-default-ClassMaster-plus.png";

export function CompleteSetup({ user, toggleFullSetup }) {
  const [values, setValues] = useState({
    name: "",
    last_name: "",
    phone_number: "",
    identification: "",
    address: "",
  });

  useEffect(() => {
    const fetchingData = () => {
      axios
        .get(
          `https://server-classmaster-production.up.railway.app/api/users/${user.email}`,
          { headers: { Authorization: `Bearer ${user.tokenSession}` } }
        )
        .then((Response) => {
          setValues({
            avatar: Response.data.avatar,
            name: Response.data.name,
            last_name: Response.data.lastName,
            phone_number: Response.data.phoneNumber,
            identification: Response.data.identification,
            address: Response.data.address,
            addAvatar: Response.data.avatar.includes("1684610855346-userdefault.")
          });
        })
        .catch((error) => {
          console.log("Error fetching user data\n" + error);
        });
    };
    fetchingData();
  }, []);

  function submit(e) {
    e.preventDefault();
    const formData = validation(values);
    
    try {
      axios
        .patch(
          `https://server-classmaster-production.up.railway.app/api/users/${user.email}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.tokenSession}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(toggleFullSetup(values.avatar, values.name))
        .catch((error) => {
          console.log("Error finishing setup\n" + error);
        });
    } catch (error) {
      console.error("Error uploading image\n", error);
    }
  }

  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file.type.includes("image")) {
      try {
        reader.onload = () => {
          setValues({ ...values, avatar: reader.result, avatarFile: file, addAvatar: false });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.log("Error uploading image \n" + error);
      }
    }
  };

  return (
    <div className="configuration-form-background">
      <form className="configuration-form" onSubmit={submit}>
        <div className="configuration-form__title-box">
          <h3 className="configuration-form__title">
            {"Terminemos de configurar tu cuenta"}
          </h3>
        </div>
        <div className="configuration-form__exit">
          <FontAwesomeIcon
            icon={faXmark}
            className="configuration-form__exit__icon cursor_pointer"
            onClick={toggleFullSetup}
          />
        </div>
        <div className="configuration-form__content">
          <div className="configuration-form__content__profile">
            <div className="configuration-form__content__image">
              {values.avatar && (
                <img src={values.avatar}alt="avatar"className="form__content__image"/>
              )}
              {values.addAvatar && (
                <img src={addAvatar}alt="avatar-plus"className="form__content__image"/>
              )}
              <input
                name="avatar"
                type="file"
                className="form__content__image-input cursor_pointer"
                onChange={handleFile}
              />
            </div>
            <div className="configuration-form__content__profile__inputs">
              <div className="configuration-form__labels">
                <p>Nombres:</p>
              </div>
              <input
                name="name"
                type="text"
                value={values.name}
                className="profile__input"
                onChange={handleInput}
              />
              <div className="configuration-form__labels">
                <p>Apellidos:</p>
              </div>
              <input
                name="last_name"
                type="text"
                value={values.last_name}
                className="profile__input"
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="configuration-form__content__additional">
            <div className="configuration-form__content__additional__inputs">
              <p className="additional__label configuration-form__labels">
                Telefono:
              </p>
              <input
                name="phone_number"
                type="number"
                value={values.phone_number}
                className="additional__input"
                onChange={handleInput}
              />
              <p className="additional__label configuration-form__labels">
                Identificacion:
              </p>
              <input
                name="identification"
                type="number"
                value={values.identification}
                className="additional__input"
                onChange={handleInput}
              />
              <p className="additional__label configuration-form__labels">
                Direccion:
              </p>
              <input
                name="address"
                type="text"
                value={values.address}
                className="additional__input"
                onChange={handleInput}
              />
            </div>
          </div>
        </div>
        <div className="configuration-form__buttons">
          <button onClick={toggleFullSetup}
            className="configuration-form__button cursor_pointer"
          >
            Luego
          </button>
          <button type="submit"
            className="configuration-form__button cursor_pointer"
          >
            Aceptar
          </button>
        </div>
      </form>
    </div>
  );
}

function validation(values) {
  const formData = new FormData();
  let count = 0

  if (!values.avatar.includes("1684610855346-userdefault.jpg")) {
    values.avatarFile && formData.append("avatar", values.avatarFile)
    count++
  }
  if (values.name != "" && /[a-zA-Z]/.test(values.name)) {
    formData.append("name", values.name)
    count++
  }
  if (values.last_name != "" && /[a-zA-Z]/.test(values.last_name)) {
    formData.append("lastName", values.last_name)
    count++
  }
  if (values.phone_number != "" && values.phone_number.length > 6) {
    formData.append("phoneNumber", values.phone_number);
    count++
  }
  if (values.identification != "" && values.identification.length > 6) {
    formData.append("identification", values.identification)
    count++
  }
  if (values.address != "" && /[a-zA-Z]/.test(values.address)) {
    formData.append("address", values.address)
  }
  if (count > 4) {
    formData.append("fullSetup", true)
  }

  return formData
}