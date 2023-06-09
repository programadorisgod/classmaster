import { Link } from 'react-router-dom';
import imagen  from '../../../Images/Logo.png';

export function Header() {
    return(
        <header className="header">
            <img src={imagen} alt="header__logo" width={50} height={40}/>
            <h3 className='header__title'>ClassMaster</h3>
            <Link to={"/Login"} className='header__link-btn'>Login</Link>  
        </header>
    )    
}