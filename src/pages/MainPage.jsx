import React from "react";
import MainLayout from "../layouts/MainLayout";
import Sidebar from '../components/Sidebar/Sidebar';
import Recommended from '../components/Recommended/Recommended';
import Products from '../components/Products/Products';

function MainPage() {
    return (
        <MainLayout>
            <div className="container d-flex">
                <div style={{minWidth: "180px"}}>
                    <Sidebar/>
                </div>
                <div className="flex-row-1">
                    <Recommended />
                    <Products/>
                </div>
            </div>
        </MainLayout>
    )
}

export default MainPage;