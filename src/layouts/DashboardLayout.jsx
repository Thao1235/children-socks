import React from "react";
import Menu from "../components/Dashboard/Menu/Menu";
import NavbarDashboard from "../components/Dashboard/Navbar/NavbarDashboard";

function DashboardLayout({ children }) {
    return (
        <div className="container">
            <NavbarDashboard />
            <div className="d-flex py-2">
                <div style={{ minWidth: '180px' }}>
                    <Menu />
                </div>
                <div className="flex-grow-1">
                    { children }
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout;