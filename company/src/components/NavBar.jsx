import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";


function NavBar() {
    function logOut() {

        Cookies.remove("userId");
        console.log(Cookies.get());
    }

    return (
        <header id="navBar">
            <div className="top-header">
                <div>
                    <h2 className="logo">
                        <NavLink className='NavLink' to="/Home">Home</NavLink>
                    </h2>
                </div>
                <div className="right-links">
                        <NavLink className='NavLink' to="/deal">
                           Create Deal
                        </NavLink>
                        <NavLink className='NavLink' to="/admin">
                           admin
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