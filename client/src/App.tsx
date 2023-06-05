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

function App() {
    const queryClient = new QueryClient()

    return (
        <div className="rapidtyperApp">
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <Header>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/account" element={<Account />} />
                            <Route path="/singleplayer" element={<Singleplayer />} />
                            <Route path="/multiplayer/:code" element={<Multiplayer />} />
                            <Route path="/user/:username" element={<Profile />} />
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
