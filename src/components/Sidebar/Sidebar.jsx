import React from "react";
import Category from './Category';
import Price from './Price';
import Colors from "./Colors";

function Sidebar() {
    return (
        <div className="d-flex flex-column border-end me-1 h-100">
            <Category />
            <Price />
            <Colors />
        </div>
    )
}

export default Sidebar;