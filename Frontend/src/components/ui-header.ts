class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        const index = this.#add_path_correction("index.html")

        this.innerHTML = `
         <header class="header">
            <img
                src="/luuppi.logo.svg"
                onclick="window.location.href='${index}'"
                style="height: 60px; cursor: pointer"
                alt="Luuppi Logo"
            />
            <h1>LÄRPÄKE</h1>
            <div
                class="menu-icon"
                id="ui-header-change-language-btn"
                style="display: flex; justify-content: center; align-items: center">
                <img class="globle" src="/icons/globle.png" height="30px" width="auto" />
            </div>
            <div
                class="menu-icon"
                id="ui-header-profile-btn"
                style="display: flex; justify-content: center; align-items: center">
                <img class="profile-icon" src="/icons/profile-icon.png" height="30px" width="auto" />
            </div>
            <div class="menu-icon" id="ui-header-open-menu-btn">☰</div>
        </header>
         `;

        const languageBtn = this.querySelector<HTMLDivElement>("#ui-header-change-language-btn");
        if (languageBtn == null) {
            throw new Error("Language button not found");
        }
        languageBtn.addEventListener("click", (_) => {
            this.changeLanguage();
        });

        const profileBtn = this.querySelector<HTMLDivElement>("#ui-header-profile-btn");
        if (profileBtn == null) {
            throw new Error("Profile button not found");
        }
        profileBtn.addEventListener("click", (_) => {
            this.toggle();
        });

        const menuBtn = this.querySelector<HTMLDivElement>("#ui-header-open-menu-btn");
        if (menuBtn == null) {
            throw new Error("Menu button not found");
        }
        menuBtn.addEventListener("click", (_) => {
            this.toggle();
        });
    }

    // Runs when object is disconnected from DOM
    disconnectedCallback() {}

    toggle() {
        const nameOverride = this.getAttribute("side-panel-name");
        console.log(nameOverride);
        toggleSidePanelOutsider(nameOverride);
    }

    changeLanguage() {
        changeLanguage();
    }

    #add_path_correction(path: string): string {
        /* Path depth should be positive number
         * For example 2 = ../../<path>
         */
        const pathDepth = this.getAttribute("path-depth") as number | null;

        // Build correction
        let correction = "";
        if (pathDepth != null && pathDepth > 0) {
            for (let i = 0; i < pathDepth; i++) {
                correction += "../";
            }
        }

        if (correction == "") {
            return path;
        }

        // Add correction
        return correction + path;
    }
}

function changeLanguage(): void {
    console.log("change language");

    // Add language if none are defined in url (from proxying)
    const currentUrl = addMissingLanguage(window.location.href);
    let newUrl;

    if (currentUrl.includes("/fi/")) {
        newUrl = currentUrl.replace("/fi/", "/en/");
    } else if (currentUrl.includes("/en/")) {
        newUrl = currentUrl.replace("/en/", "/fi/");
    } else {
        return;
    }
    window.open(newUrl, "_self");
}

function addMissingLanguage(currentUrl: string): string {
    if (currentUrl.includes("/en/") || currentUrl.includes("/fi/")) {
        return currentUrl;
    }

    /* user haven't chosen language, so the language choice
     * was made at proxy level meaning language is fi
     * calculate index where to put '/fi/' and
     *
     * Url is in format http(s)://domain.do/<some>/<stuff>
     * Find first :// and next / for append location
     */

    let sepIndex = currentUrl.indexOf("://");
    if (sepIndex > 0) {
        sepIndex += "://".length;
    } else {
        sepIndex = 0;
    }

    sepIndex = currentUrl.indexOf("/", sepIndex);
    if (sepIndex < 0) {
        // entire url is domain, add to end
        return `${currentUrl}/fi/`;
    }

    const before = currentUrl.slice(0, sepIndex); // take http(s)://domain.do
    const after = currentUrl.slice(sepIndex, currentUrl.length); // take /<some>/<stuff>
    return `${before}/fi${after}`; // after contains separator /
}

function toggleSidePanelOutsider(nameOverride: string | null = null): void {
    // If side panel is not found with default name and name is overridden
    const searchName = nameOverride == null ? "side-panel-element" : nameOverride;

    const panel: HTMLElement | null = document.getElementById(searchName);
    if (panel != null) {
        panel.classList.toggle("open");
    }
}

if ("customElements" in window) {
    customElements.define("ui-header", Header);
}
