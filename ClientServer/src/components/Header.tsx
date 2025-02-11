import "../styles/header.module.css";

function gotoHome() {
    window.location.href = "main.html";
}

export function toggleSidePanel() {
    const panel = document.getElementById("sidePanel");
    panel?.classList.toggle("open");
}

export default function Header() {
    return (
        <header>
            <img
                className="header-logo"
                src="luuppi.logo.svg"
                onClick={gotoHome}
                alt="Luuppi Logo"
            ></img>
            <h1>LÄRPÄKE</h1>
            <span className="menu-icon" onClick={toggleSidePanel}>
                ☰
            </span>
        </header>
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
                    <a href="main.html">Koti</a>
                </li>
                <li>
                    <a href="larpake.html">Lärpäke</a>
                </li>
                <li>
                    <a href="statistics.html">Oma statistiikka</a>
                </li>
                <li>
                    <a href="latest_accomplishment.html">
                        Viimeisimmät suoritukset
                    </a>
                </li>
                <li>
                    <a href="common_statistics.html">Yhteiset statistiikat</a>
                </li>
                <li>
                    <a href="upcoming_events.html">Tulevat tapahtumat</a>
                </li>
                <li>
                    <a href="own_tutors.html">Omat tutorit</a>
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
