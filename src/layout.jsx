import React from "react";
import { Outlet,ScrollRestoration } from "react-router-dom";
import Footer from "./components/Footer";

export default function Layout(){

    return(
        <>
        <ScrollRestoration/>
        <Outlet/>
        <Footer/>
        </>

    );
}