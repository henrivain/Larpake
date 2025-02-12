import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import "../styles/event_marking.css";
import Header, { SidePanel } from "../components/Header.tsx";

// Define event structure
interface Event {
  title: string;
  path: string;
  updated: string;
  description: string;
  code: string;
  date: string;
  time: string;
  location: string;
}

const eventDatabase: { [key: string]: Event } = {
  1: {
    title: "KAUPUNKIKÄVELY (3P)",
    path: "Lärpäke / Ensi askeleet / Kaupunkikävely",
    updated: "19.01.2024 klo 12.00",
    description: "Osallistu orientaatioviikon kaupunkikävelyyn.",
    code: "MOIKKA69",
    date: "Tiistai 20. elok.",
    time: "15:00-19:00",
    location: "Tampereen keskusta",
  },
  2: {
    title: "POIKKITIETEELLINEN TAPAHTUMA TAMPEREELLA 3P",
    path: "Lärpäke / Kaikenlaista / Poikkitieteellinen tapahtuma Tampereella",
    updated: "19.01.2024 klo 12.00",
    description: "Osallistu (Luupin ja) toisen ainejärjestön kanssa järjestettävään tapahtumaan. Kolmiobileiden kaltaiset opiskelijabileet eivät käy poikkitieteellisestä tapahtumasta. Valmistaudu todistamaan osallistumisesi kuvatodistein tai haalarimerkein!",
    code: "WXYZ6789",
    date: "XX.YY.ZZZZ",
    time: "XX:XX-YY:YY",
    location: "Tampere",
  },
  3: {
    title: "SYÖ SIIPIÄ, VEGESIIPIÄ, MUSTAMAKKARAA TAI PYYNIKIN MUNKKEJA 2P",
    path: "Lärpäke / Tanpereella / Syö siipiä, vegesiipiä, mustamakkaraa tai Pyynikin munkkeja",
    updated: "19.01.2024 klo 12.00",
    description: "Syö tamperelaista perinneruokaa ravintolassa. Todistukseksi kelpaa tuore kuva tai tuutorin läsnäolo.",
    code: "HGER41J9",
    date: "XX.YY.ZZZZ",
    time: "XX:XX-YY:YY",
    location: "Pirkanmaa",
  },
};

const EventDetails: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const eventId = queryParams.get('eventId');

    if (eventId && eventDatabase[eventId]) {
      setEvent(eventDatabase[eventId]);
    }
  }, [location]);

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  if (!event) {
    return (
        <>
        <Header/>
        <SidePanel />
        <div className="container">
            <h1 id="event-title" style={{ textAlign: "left" }}>{"ERROR"}</h1>
            <p id="event-updated" style={{ textAlign: "left" }}>Updated: {"01.01.1900"}</p>
            <p style={{ textAlign: "left" }}>{"NO EVENT INFORMATION"}</p>
            <div className="qr-section">
              <p>Show this QR code to any tutor to verify participation:</p>
              <p>QR-CODE-IMAGE</p>
              <p>or use this code:</p>
              <p id="event-code">{"1234-ABCD"}</p>
            </div>
          </div>
        </>
    );
  }

  return (
    <>
    <Header/>
    <SidePanel />
    <div className="container">
        <h1 id="event-title" style={{ textAlign: "left" }}>{event.title}</h1>
        <p id="event-updated" style={{ textAlign: "left" }}>Updated: {event.updated}</p>
        <p style={{ textAlign: "left" }}>{event.description}</p>
        <div className="qr-section">
          <p>Show this QR code to any tutor to verify participation:</p>
          <QRCode value={event.code} size={256} className="qr-canvas" />
          <p>or use this code:</p>
          <p id="event-code">{event.code}</p>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
