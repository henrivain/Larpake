import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home.tsx";
import {
    PublicClientApplication,
    EventType,
    AuthenticationResult,
} from "@azure/msal-browser";
import { loginRequest, msalConfig } from "./authConfig.ts";
import {
    AuthenticatedTemplate,
    MsalProvider,
    UnauthenticatedTemplate,
    useMsal,
} from "@azure/msal-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LarpakePage from "./pages/LarpakePage.tsx";
import OwnStatistics from "./pages/OwnStatistics.tsx";

// This should be initialized outside component tree to prevent re-renders
const msalInstance = new PublicClientApplication(msalConfig);

// Activate first account if no active account
if (
    !msalInstance.getActiveAccount() &&
    msalInstance.getAllAccounts().length > 0
) {
    msalInstance.setActiveAccount(msalInstance.getActiveAccount()![0]);
}

// Listen to signup event
msalInstance.addEventCallback((event) => {
    if (
        event.eventType === EventType.LOGIN_SUCCESS &&
        (event.payload as AuthenticationResult).account
    ) {
        const account = (event.payload as AuthenticationResult).account;
        msalInstance.setActiveAccount(account);
    }
});

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const MainContent = () => {
    const { instance } = useMsal();

    const activeAccount = instance.getActiveAccount();

    const handleRedirect = () => {
        instance
            .loginRedirect({
                ...loginRequest,
                prompt: "create",
            })
            .catch((error) => console.log(error));
    };

    return (
        <div>
            <AuthenticatedTemplate>
                {activeAccount ? <Home /> : null}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <button onClick={handleRedirect}>Sign up</button>
            </UnauthenticatedTemplate>
        </div>
    );
};


root.render(
    <React.StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/larpake.html" element={<LarpakePage />}></Route>
        <Route path="/statistics.html" element={<OwnStatistics />}></Route>
    </Routes>
    </BrowserRouter>
    </React.StrictMode>
);
