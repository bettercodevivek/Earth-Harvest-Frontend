import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import ScrollToHash from "./scrollToHash";
import ScrollToTop from "./scrollToTop";
import Footer from './components/Footer'
import { AuthProvider } from "./contexts/AuthContext";
import LoginModal from "./components/LoginModal";
import OTPModal from "./components/OTPModal";


export default function Layout(){
   
    return(
            <>
            <AuthProvider>
            <ScrollToTop/>
            <ScrollRestoration/>
            <ScrollToHash/>
                <Outlet/>
                <Footer/>
                <LoginModal />
                <OTPModal />
                </AuthProvider>
                </>
            )
}