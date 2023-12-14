import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProductList from "../../components/Dashboard/ProductManagement/ProductList";

function ProductManagementPage(){
    return (
        <DashboardLayout>
           <ProductList/>
        </DashboardLayout>
    )
}

export default ProductManagementPage;