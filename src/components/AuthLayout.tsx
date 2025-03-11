import { Outlet } from 'react-router-dom';
import logo from "../assets/antonella_text.png";
import icon from "../assets/antonella_logo.png";
import "../styles/Login.css";

export const AuthLayout = () => {
    return (
        <div className="container">
            <div className='left'>
                <img src={icon} width="150" height="100"/>
            </div>
            <div className="right">
                <img src={logo} className="logo" />
                <Outlet />
            </div>
        </div>
    )
}