import React, { useEffect } from "react"
import "./lg.css"

export default function Imprint() {
    
    useEffect(() => {
        document.title = "Imprint | RapidTyper"
        window.location.href = 'https://grovider.de/impressum';
    }, [])

    return (
        <>
            <div className="imprintReset">
                <div className="wstop">
                    <p style={{ fontSize: 20, marginBottom: 8 }}>Language:</p>
                    <a className="btn" style={{ marginBottom: 8 }} href="#en">
                        English →
                    </a>
                    <br />
                    <a className="btn" href="#de">
                        Deutsch →
                    </a>
                </div>
                <h1 id="en">Imprint (EN)</h1>
                <h2 id="m46">Service provider</h2>
                <p>Grovider Ltda.</p>
                <p>Naranjal, 1km Al Sur De La Iglesia Catolica</p>
                <p>50207 Nosara</p>
                <p>Costa Rica</p>
                <h2 id="m56">How to contact us</h2>
                <p>E-mail address: </p>
                <p>
                    <a className="imprintLink groviderItf" href="mailto:rapidtyper@grovider.co">
                        rapidtyper@grovider.co
                    </a>
                </p>
                <p>Kontaktformular: </p>
                <p>
                    <a className="imprintLink groviderItf" href="https://rapidtyper.com/contact" target="_blank" rel="noreferrer">
                        https://rapidtyper.com/contact
                    </a>
                </p>
                <h2 id="m174">Online Dispute Resolution</h2>
                <p>
                    Online Dispute Resolution: The European Commission provides a platform for online dispute resolution (ODR), which can be found at{" "}
                    <a className="imprintLink groviderItf" href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer">
                        https://ec.europa.eu/consumers/odr/
                    </a>
                    . Consumers have the possibility to use this platform for the settlement of their disputes.
                </p>
                <h2 id="m65">Liability and property rights information</h2>
                <p>
                    Liability disclaimer: The contents of this online offer have been prepared carefully and according to our current knowledge, but are for information purposes only and do not have
                    any legally binding effect, unless it is legally obligatory information (e.g. the imprint, the privacy policy, GTC or obligatory instructions of consumers). We reserve the right to
                    change or delete the contents in whole or in part, provided that contractual obligations remain unaffected. All offers are subject to change and non-binding.
                </p>
                <hr />
                <h1 id="de">Impressum (DE)</h1>
                <h2 id="m46">Diensteanbieter</h2>
                <p>Grovider Ltda.</p>
                <p>Naranjal, 1km Al Sur De La Iglesia Catolica</p>
                <p>50207 Nosara</p>
                <p>Costa Rica</p>
                <h2 id="m56">Kontaktmöglichkeiten</h2>E-Mail-Adresse:{" "}
                <p>
                    <a className="imprintLink groviderItf" href="mailto:rapidtyper@grovider.co">
                        rapidtyper@grovider.co
                    </a>
                </p>
                Kontaktformular:{" "}
                <p>
                    <a className="imprintLink groviderItf" href="https://rapidtyper.com/contact" target="_blank" rel="noreferrer">
                        https://rapidtyper.com/contact
                    </a>
                </p>
                <h2 id="m174">Online-Streitbeilegung</h2>
                <p>
                    Online-Streitbeilegung: Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (ODR) bereit, die Sie unter{" "}
                    <a className="imprintLink groviderItf" href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer">
                        https://ec.europa.eu/consumers/odr/
                    </a>{" "}
                    finden. Verbraucher haben die Möglichkeit, diese Plattform für die Beilegung ihrer Streitigkeiten zu nutzen.
                </p>
                <h2 id="m65">Haftungs- und Schutzrechtshinweise</h2>
                <p>
                    Haftungsausschluss: Die Inhalte dieses Onlineangebotes wurden sorgfältig und nach unserem aktuellen Kenntnisstand erstellt, dienen jedoch nur der Information und entfalten keine
                    rechtlich bindende Wirkung, sofern es sich nicht um gesetzlich verpflichtende Informationen (z.B. das Impressum, die Datenschutzerklärung, AGB oder verpflichtende Belehrungen von
                    Verbrauchern) handelt. Wir behalten uns vor, die Inhalte vollständig oder teilweise zu ändern oder zu löschen, soweit vertragliche Verpflichtungen unberührt bleiben. Alle Angebote
                    sind freibleibend und unverbindlich.
                </p>
            </div>
        </>
    )
}
