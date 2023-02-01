import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {usePermission} from "../context/permissionContext"


function NavBar() {
    const{permission} = usePermission();
    function logOut() {
        Cookies.remove("userId");
        console.log(Cookies.get());
    }

    return (
        <header id="navBar">
            <div className="top-header">
                <div>
                    <h2 className="logo">
                        <NavLink className='NavLink' to="/Home">Tripify.com</NavLink>
                    </h2>
                </div>
                <div className="right-links">
                {permission==='admin'?<NavLink className='NavLink' id="admin-btn" to="/admin">
                        admin
                    </NavLink>:null}
                    <NavLink className='NavLink' to="/deal">
                        Create Deal
                    </NavLink>
                    <NavLink className='NavLink' onClick={logOut} id="logOutButton" to="/">
                        Logout
                    </NavLink>
                </div>
            </div>

            <div>


            </div>
        </header>
    );
}

export default NavBar;