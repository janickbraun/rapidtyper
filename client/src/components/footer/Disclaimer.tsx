import React, { useEffect } from "react"
import "./lg.css"

export default function Disclaimer() {
    useEffect(() => {
        document.title = "Disclaimer | RapidTyper"
    }, [])
    return (
        <>
            <div className="imprintReset disclaimer______________________________fix" style={{ marginTop: "7rem" }}>
                <h1 id="en">Disclaimer</h1>
                <p>Last update: Jun 12 2023</p>
                <h2 id="m46">Website Disclaimer</h2>
                <p>
                    The information provided by Grovider Ltda ("we," "us," or "our") on{" "}
                    <a className="imprintLink " href="https://rapidtyper.com">
                        https://rapidtyper.com
                    </a>{" "}
                    (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express
                    or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site. UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY
                    TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON
                    ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.
                </p>
                <h2 id="m46">External Links Disclaimer</h2>
                <p>
                    The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in
                    banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. WE
                    DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY
                    WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY
                    PROVIDERS OF PRODUCTS OR SERVICES.
                </p>
            </div>
        </>
    )
}
