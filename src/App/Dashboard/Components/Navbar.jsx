import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { RiUserSettingsLine } from "react-icons/ri";

export function Navbar({ user, title, updateState, signOff }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="navbar">
      <h1 className="navbar-label">{title}</h1>
      <div className="dropdown" ref={dropdownRef}>
        <img
          src={user.avatar}
          className="dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
        />
        <h5 className="dropdown-text">{user.name}</h5>
        {isOpen && (
          <div className="dropdown-menu">
            <ul>
              <li className="dropdown-item 1" onClick={() => updateState("Cuenta")}>
                <RiUserSettingsLine size={17} />
                <span>Mi cuenta</span>
              </li>
              <Link className="dropdown-item i-2" to={"/Login"}>
                <IoLogOutOutline size={18} />
                <span
                  onClick={() => {
                    signOff();
                    window.location.href = "./Login";
                  }}
                >
                  Cerrar Sesión
                </span>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
