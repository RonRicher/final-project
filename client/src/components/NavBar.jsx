import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../context/userContext";

function NavBar() {

    const { userId } = useUser;

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
                    <a className="companyRefFromClient" href="/personal/trip">plan your own trip</a>
                    <a className="companyRefFromClient" href='http://localhost:4000'>List your company</a>
                    {userId ? <NavLink className='NavLink' to="/">LogIn</NavLink> :
                        <NavLink className='NavLink' onClick={logOut} id="logOutButton" to="/">
                            Logout
                        </NavLink>}
                </div>
            </div>

            <div>


            </div>
        </header>
    );
}

export default NavBar;