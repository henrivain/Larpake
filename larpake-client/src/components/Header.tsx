import React from "react";
import { Helmet } from "react-helmet";

import "../types.d.ts";
import "../styles/header.css";
import luuppiLogo from "../assets/luuppi.logo.svg";

function gotoHome() {
    window.location.href = "main.html";
}

export function toggleSidePanel() {
    const panel = document.getElementById("sidePanel");
    panel?.classList.toggle("open");
}

export default function Header() {
    return (
        <>
            <Helmet>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Luuppi - Lärpake</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                    rel="stylesheet"
                />
            </Helmet>
            <header className="header">
                <img
                    style={{ height: "60px", cursor: "pointer" }}
                    src={luuppiLogo}
                    onClick={gotoHome}
                    alt="Luuppi Logo"
                ></img>
                <h1>LÄRPÄKE</h1>
                <span className="menu-icon" onClick={toggleSidePanel}>
                    ☰
                </span>
            </header>
        </>
    );
}

export function SidePanel() {
    return (
        <div className="side-panel" id="sidePanel">
            <span className="close-btn" onClick={toggleSidePanel}>
                X
            </span>
            <ul>
                <li>
                    <a href="/">Koti</a>
                </li>
                <li>
                    <a href="larpake.html">Lärpäke</a>
                </li>
                <li>
                    <a href="statistics.html">Omat tilastot</a>
                </li>
                <li>
                    <a href="latest_accomplishment.html">
                        Viimeisimmät suoritukset
                    </a>
                </li>
                <li>
                    <a href="common_statistics.html">Yhteiset tilastot</a>
                </li>
                <li>
                    <a href="upcoming_events.html">Tulevat tapahtumat</a>
                </li>
                <li>
                    <a href="own_tutors.html">Omat tuutorit</a>
                </li>
                <li>
                    <a href="event_marking.html">Fuksi_marking_event</a>
                </li>
                <li>
                    <a href="tutor_mark_event.html">Tutor_mark_event</a>
                </li>
            </ul>
        </div>
    );
}
