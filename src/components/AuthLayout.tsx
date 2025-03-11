import { Outlet } from 'react-router-dom';
import logo from "../assets/antonella_text.png";
import icon from "../assets/antonella_logo.png";
import "../styles/login.css";

export const AuthLayout = () => {
    return (
        <div className="container">
            <div className='left'>
                <img src={icon} width="100%" height="15%" style={{float: "left"}}/>
            </div>
            <div className="right">
                <img src={logo} className="logo" />
                <Outlet />
            </div>
        </div>
    )
}