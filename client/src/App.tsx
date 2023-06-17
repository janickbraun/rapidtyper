import React from "react"
import About from "./components/about/About"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import NotFound from "./components/notFound/NotFound"
import Home from "./components/home/Home"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Account from "./components/account/Account"
import Singleplayer from "./components/play/Singleplayer"
import Multiplayer from "./components/play/Multiplayer"
import Profile from "./components/account/Profile"
import Imprint from "./components/footer/Imprint"
import PrivacyPolicy from "./components/footer/PrivacyPolicy"
import Disclaimer from "./components/footer/Disclaimer"
import CookieModal from "./components/account/CookiesModal"
import Terms from "./components/footer/Terms"
import SignUp from "./components/account/SignUp"
import Login from "./components/account/Login"
import Forgot from "./components/account/Forgot"
import Reset from "./components/account/Reset"
import Verify from "./components/account/Verify"
import Shop from "./components/shop/Shop"
import Success from "./components/shop/Success"
import Cancel from "./components/shop/Cancel"

function App() {
    const queryClient = new QueryClient()

    return (
        <div className="rapidtyperApp">
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <Header>
                        <CookieModal />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/account/" element={<Account />} />
                            <Route path="/account/login" element={<Login />} />
                            <Route path="/account/signup" element={<SignUp />} />
                            <Route path="/singleplayer/" element={<Singleplayer />} />
                            <Route path="/multiplayer/:code/" element={<Multiplayer />} />
                            <Route path="/user/:username/" element={<Profile />} />
                            <Route path="/imprint" element={<Imprint />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/disclaimer" element={<Disclaimer />} />
                            <Route path="/terms-of-service" element={<Terms />} />
                            <Route path="/account/forgot" element={<Forgot />} />
                            <Route path="/account/reset" element={<Reset />} />
                            <Route path="/account/verify" element={<Verify />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/shop/success" element={<Success />} />
                            <Route path="/shop/cancel" element={<Cancel />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        <Footer />
                    </Header>
                </QueryClientProvider>
            </BrowserRouter>
        </div>
    )
}

export default App
