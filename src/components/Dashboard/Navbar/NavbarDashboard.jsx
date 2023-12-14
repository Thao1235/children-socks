import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { PiSignOut } from "react-icons/pi";
import { Link } from "react-router-dom";

function NavbarDashboard () {
    return (
        <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
            <div style={{ minWidth: '180px' }} className="d-flex align-items-center">
                <Link to={'/dashboard/order-list'} className="logo">
                    <FaCartPlus size={22} className="me-2" /> TRANG THỐNG KÊ
                </Link>
            </div>
            <div>
                <Link to={'/main'}>
                    TRỞ VỀ TRANG CHỦ <PiSignOut/>
                </Link>
            </div>
        </div>
    )
}

export default NavbarDashboard;