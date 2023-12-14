import React from "react";
import Navbar from '../components/Navbar/Navbar';

function MainLayout ({children}) {
    return(
        <>
            <Navbar />
            {children}
        </>
    )
}

export default MainLayout;
