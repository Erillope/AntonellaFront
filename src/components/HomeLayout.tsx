import { SideBar } from "../components/SideBar"
import { Outlet } from "react-router-dom";
import "../styles/homeLayout.css";
import icon from "../assets/antonella_logo.png";

export const HomeLayout = () => {
    return (
        <div className="homeLayoutContainer">
            <div className="topCanvas">
                <img src={icon} width = "8%" height = "100%" style={{float: "left"}}/>
            </div>
            <div className="viewContainer">
                <SideBar />
                <div style={{backgroundColor: 'white', width: '100%', boxSizing: 'border-box', paddingLeft: '20px', paddingRight: '20px', overflowY: 'auto', paddingBottom: '20px'}}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}