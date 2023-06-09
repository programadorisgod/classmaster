import "./Css/Login.css";
import ilustration from "../../Images/Ilustration-Login.png";
import { Login } from "./Components/Login";
import { Signin } from "./Components/Signin";
import { useState } from "react";

export  default function Access({Form = "Login"}) {
  const [currentForm, setCurrentForm] = useState(Form);

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <section className="Access">
      {currentForm === "Login" ? <Login onFormSwitch={toggleForm}/> : <Signin onFormSwitch={toggleForm}/>}
      <div className="access-box imagen-svg">
        <img src={ilustration} className="imagen-svg__img"></img>
      </div>
    </section>
  );
}