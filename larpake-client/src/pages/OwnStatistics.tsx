import React from "react";
import Header, { SidePanel } from "../components/Header.tsx";
import "../styles/statistics.css";

export default function OwnStatistics(){
    return (
        <>
        <Header/>
        <SidePanel />
        <div className="container">  
        <div align="left">Lärpäke / Oma statistiikka</div>
        <p className="greeting">Tervehdys arvon fuksi, olet mahtavassa vauhdissa!</p>
        <ul className="stats-list">
            <li>ENSI ASKELEET <span className="stat-value">21 / 49</span></li>
            <li>PIENEN PIENI LUUPPILAINEN <span className="stat-value">17 / 58</span></li>
            <li>PII-KLUBILLA TAPAHTUU <span className="stat-value">5 / 10</span></li>
            <li>NORMIPÄIVÄ <span className="stat-value">20 / 23</span></li>
            <li>YLIOPISTOELÄMÄÄ <span className="stat-value">8 / 32</span></li>
            <li>VAIKUTUSVALTAA <span className="stat-value">35 / 54</span></li>
            <li>LIIKUNNALISTA <span className="stat-value">13 / 25</span></li>
            <li>KAIKENLAISTA <span className="stat-value">24 / 33</span></li>
            <li>TANPEREELLA <span className="stat-value">18 / 20</span></li>
          </ul>
          <div className="total">
            YHTEENSÄ: <span className="total-value">161 / 304</span>
          </div>
        <div className="pagination">
            <a href="larpake.html?page=14"><button id="prev-page">&lt;</button></a>
            <span id="page-info">16 / 16</span>
            <button id="next-page" disabled>&gt;</button>
        </div>
    </div>

        
        </>
    )
}