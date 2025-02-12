import React, { useState, useEffect } from "react";
import Header, { SidePanel } from "../components/Header.tsx";
import "../styles/larpake.css";
import kiasaImage from "../assets/kiasa.png";
import { useSearchParams, useNavigate } from "react-router-dom";

interface Page {
  header: string;
  buttons: string[];
}

const pages: Page[] = [
  {
    header: "Lärpäke / Ensi askeleet",
    buttons: [
      "ENSI ASKELEET - OTSIKKO",
      "TUTUSTUMISILTA 19.8 5P",
      "KAUPUNKIKÄVELY 3P",
      "TUTUSTUMISSAUNA 20.8 5P",
      "PUISTOHENGAILU 3P - PERUUTETTU",
      "KAMPUSKIERROS 3P"
    ]
  },
  {
    header: "Lärpäke / Ensi askeleet",
    buttons: [
      "KÄY PÄÄAINEESI ALOITUSLUENNOLLA 2P",
      "OSALLISTU TREY:N FUKSISUUNNISTUKSEEN 5P",
      "LÄRPÄKKEEN PÄÄLLYSTYS TAI KORISTELU 2P",
      "KERÄÄ VIIDELTÄ TUUTORILTA ALLEKIRJOITUS 5P",
      "FUKSIRYHMÄN TAPAHTUMA 5P",
      "KUMMIRYHMÄN TAPAHTUMA 5P"
    ]
  },
  {
    header: "Lärpäke / Ensi askeleet",
    buttons: [
      "PUBIRUNDI 3P",
      "LAULA KARAOKESSA 2P",
      "FUKSIKEILAUS 4P",
      "PIENEN PIENI LUUPPILAINEN - OTSIKKO",
      "LIITY LUUPIN JÄSENEKSI 20P",
      "TILAA HAALARIT 10P"
    ]
  },
  {
    header: "Lärpäke / Pienen pieni luuppilainen",
    buttons: [
      "OSTA LUUPIN HAALARIMERKKI 2P",
      "JUTTELE KYYKÄSTÄ DDRNV:N JÄSENEN KANSSA 2P",
      "OSTA LUUPPI-TUOTE (pl. Luuppi-haalarimekki) 3P",
      "OMPELE 5 HAALARIMERKKIÄ 6P",
      "OSALLISTU KOPO-TAPAHTUMAAN 5P",
      "KIERTOAJELU 5P"
    ]
  },
  {
    header: "Lärpäke / Pii-Klubilla tapahtuu",
    buttons: [
      "KASTAJAISET 5P",
      "PII-KLUBILLA TAPAHTUU - OTSIKKO",
      "KÄY TOIMISTOLLA 2P",
      "KEITÄ PANNULLINEN KAHVIA 3P",
      "PULLAPÄIVÄ 2P",
      "OSALLISTU TALKOOPÄIVÄÄN 3P"
    ]
  },
  {
    header: "Lärpäke / Normipäivä",
    buttons: [
      "NORMIPÄIVÄ - OTSIKKO",
      "ENNAKKOLIPPU KOLMIOILLE 3P",
      "OSALLISTU KOLMIOIDEN VIRALLISILLE ETKOILLE 26.9 3P",
      "KOTIBILEET/ETKOT (OMAT/LUUPPILAISEN) 2P",
      "SITSIT 3P",
      "PELI-ILTA 3P"
    ]
  },
  {
    header: "Lärpäke / Normipäivä",
    buttons: [
      "LAUTAPELI-ILTA 3P",
      "LANIT 2P",
      "MUU TAPAHTUMA 5P",
      "YLIOPISTOELÄMÄÄ - OTSIKKO",
      "SELVITÄ KOULUTUSASIANTUNTIJASI NIMI 2P",
      "LUO OMA HOPS 5P"
    ]
  },
  {
    header: "Lärpäke / Yliopistoelämää",
    buttons: [
            "SIVUAINEPANEELI 5P",
            "MTT-TIE-KAHVIT 3P",
            "KÄY LASKUTUVASSA TAI LUUPIN OPINTOPIIRISSÄ 3P",
            "KÄY SYÖMÄSSÄ 4 ERI OPISKELIJARAVINTOLASSA 4P",
            "VIERAILE TOISEN AINEJÄRJESTÖN/KILLAN/KERHON TILOISSA 2P",
            "HANKI TOISEN TOISEN AINEJÄRJESTÖN/KILLAN/KERHON HAALARIMERKKI 2P"
        ]
    },
    {
        header: "Lärpäke / Yliopistoelämää",
        buttons: [
            "OSALLISTU YLIOPISTON TUTKIMUKSEEN 6P",
            "VAIKUTUSVALTAA - OTSIKKO",
            "KYSY SPONSORIA HAALAREIHIN 5P",
            "SAA SPONSORI HAALAREIHIN 15P",
            "NAKKEILE TAPAHTUMASSA 5P",
            "OSALLISTU LUUPIN HALLITUKSEN KOKOUKSEN 5P"
        ]
    },
    {
        header: "Lärpäke / Vaikutusvaltaa",
        buttons: [
            "JUTTU LUUPPISANOMIIN 7P",
            "LUUPIN HAALARIMERKKIKISA 2P",
            "OSALLISTU HALLITUSINFO-TAPAHTUMAAN 5P",
            "OSALLISTU HALLITUSPANEELLIIN 3P",
            "SÄÄNTÖMÄÄRÄINEN VUOSIKOKOUS 5P",
            "ÄÄNESTÄ TREY:N EDUSTAJISTOVAALEISSA 2P"
        ]
    },
    {
        header: "Lärpäke / Liikunnallista",
        buttons: [
            "LIIKUNNALLISTA - OTSIKKO",
            "FUKSIKYYKKÄ (ALKULOHKOT) 5P",
            "FUKSIKYYKKÄ (FINAALI) 5P",
            "LUUPIN LIIKUNTAVUORO 3P",
            "LASERTAISTELU 3P",
            "METSÄRETKI 3P"
        ]
    },
    {
        header: "Lärpäke / Kaikenlaista",
        buttons: [
            "LIIKUNTAHAASTE 3P",
            "MUU LIIKUNTATAPAHTUMA 3P",
            "KAIKENLAISTA - OTSIKKO",
            "TEK-INFO 2P",
            "LOIMU-INFO 2P",
            "SEURAA LUUPIN SOMEA (TG/IG/TT) 2P"
        ]
    },
    {
        header: "Lärpäke / Kaikenlaista",
        buttons: [
            "OSALLISTU ATK-YTP:LLE 5P",
            "OSALLISTU INTEGRAATIOFESTEILLE 5P",
            "KULTTUURITAPAHTUMA 4P",
            "POIKKITIETEELLINEN TAPAHTUMA TAMPEREELLA 3P",
            "LUUPIN PELITURNAUS 3P",
            "YRITYSTAPAHTUMA 3P"
        ]
    },
    {
        header: "Lärpäke / Tanpereella",
        buttons: [
            "KESKUSTAEXCU 3P",
            "SELVITÄ LUUPIN KIASA-NORSUN TAUSTATARINA 1P",
            "TANPEREELLA - OTSIKKO",
            "KÄY PYYNIKIN NÄKÖTORNILLA 2P",
            "KÄY HERVANNAN VESITORNILLA 2P",
            "SYÖ SIIPIÄ, VEGESIIPIÄ, MUSTAMAKKARAA TAI PYYNIKIN MUNKKEJA 2P"
        ]
    },
    {
        header: "Lärpäke / Tanpereella",
        buttons: [
            "KÄY MUSEOSSA TAMPEREELLA 2P",
            "KÄY HOTELLI TORNIN HUIPULLA 2P",
            "KÄY NÄSINNEULALLA 2P",
            "RATIKKA-AJELU 5P",
            "KÄY JOKAISELLA YLIOPISTON KAMPUKSELLA 3P",
            "- TYHJÄ"
        ]
    }
];

const getSignatureImage = (): string => {
  const signatureList = [
    "",
    "",
    "",
    "/signatures/test.png",
    "/signatures/signature_HV_2.png",
    "/signatures/siganture_HV_3.png",
    "/signatures/signature_JK_2.png",
    "/signatures/signature_JK_1.png",
    "/signatures/signature_JK_3.png"
  ];
  return signatureList[Math.floor(Math.random() * signatureList.length)];
};

const LarpakePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageNum = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState<number>(Number(pageNum) || 0);

  useEffect(() => {
    if (currentPage >= pages.length) {
      navigate("/statistics.html");
    }
  }, [currentPage, navigate]);

  const changePage = (direction: number) => {
    setCurrentPage((prev) => prev + direction);
  };

  return (
    <div>
      <Header />
      <SidePanel />
      <div className="container">  
        <div id="larpake-page-name">{pages[currentPage]?.header || "Lärpäke"}</div>
        <div id="larpake-button-container">
          {pages[currentPage]?.buttons.map((buttonText, index) => (
            <div key={index} className="button-wrapper">
              <button
                className={`button ${
                  buttonText.includes("PERUUTETTU") ? "disabled" : ""}`}
                style={{
                  fontSize: buttonText.includes("OTSIKKO") ? "25px" : "inherit",
                  visibility: buttonText.includes("TYHJÄ") ? "hidden" : "visible",
                }}
                onClick={() => {
                  if (
                    !buttonText.includes("PERUUTETTU") &&
                    !buttonText.includes("OTSIKKO") &&
                    !buttonText.includes("TYHJÄ")
                  ) {navigate(`/event_marking.html?eventId=1`);}}}>
                <div className="button-text">{buttonText.split(" - ")[0]}</div>
                {buttonText.includes("PERUUTETTU") && (
                  <div className="button-image">PERUUTETTU</div>
                )}
                {buttonText.includes("TYHJÄ") && <div className="button-image"></div>}
                {!buttonText.includes("PERUUTETTU") &&
                  !buttonText.includes("OTSIKKO") &&
                  !buttonText.includes("TYHJÄ") && (
                    <div className="button-image">
                      <img src={getSignatureImage()} alt="" />
                    </div>
                  )}
              </button>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button id="prev-page" onClick={() => changePage(-1)} disabled={currentPage === 0}>&lt;</button>
          <div id="page-info">{`${currentPage + 1} / ${pages.length + 1}`}</div>
          <button id="next-page" onClick={() => changePage(1)}>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default LarpakePage;