import { Link } from "react-router-dom";
import image from "../../../Images/imageHome.png";

export function Main() {
  return (
    <main className="main">
      <div className="main__element">
        <img src={image} alt="Home" className="main__element-img" />
      </div>
      <div className="main__element main__element-right">
        <h1 className="main__title">
          ¡Bienvenido a <span className="main__title-color">ClassMaster</span>!
        </h1>
        <br />
        <p className="main__text">
          Un aplicativo web que ayuda a los docentes a olvidarse del papeleo,
          manejo de información en diferentes apps para simplificar su día a día
          y pueda enforcarse en lo mas importante: ENSEÑAR.
        </p>
        <br />
        <Link to="/Register">
          <button className="main__btn">Registrate ya!</button>
        </Link>
      </div>
    </main>
  );
}
