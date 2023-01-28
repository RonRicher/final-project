import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";


function NavBar() {

    const [userId, setUserId] = useState("");

    useEffect(() => {
        setUserId(Cookies.get("userId"));
    });

    function logOut() {
        Cookies.remove("userId");
    }

    return (
        <header id="navBar">
            <div>
                <NavLink to="/Home">Home</NavLink>
                {true ? <NavLink to="/">LogIn</NavLink> :
                    <NavLink onClick={logOut} id="logOutButton" to="/">
                        Logout
                    </NavLink>}
            </div>
        </header>
    );
}

export default NavBar;