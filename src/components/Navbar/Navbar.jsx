import React from "react";
import { FaCartPlus, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import filtersSlice from "../../slices/filtersSlice";
import { searchTextSelector, cartSelector } from "../../redux-toolkit/selectors";


function Navbar() {
    const cart = useSelector(cartSelector)
    const searchText = useSelector(searchTextSelector)
    const dispatch = useDispatch()
    return (
        <div className="container d-flex align-items-center border-bottom py-2 mt-2">
            <div className="d-flex align-items-center" style={{ minWidth: "180px" }}>
                <Link to={"/"} className="logo">
                    <FaCartPlus size={25} className="me-2"  style={{color: 'rgb(0, 0, 255)'}}/>
                    Tất Xinh Cho Bé Yêu
                </Link>
            </div>
            <div className="d-flex flex-grow-1 justify-content-between">
                <form className="w-50 d-flex align-items-center">
                    <input
                        value={searchText}
                        type="search"
                        placeholder="Enter your attracted socks"
                        className="form-control form-control-sm"
                        style={{ paddingRight: '25px' }}
                        onInput={(e) => dispatch(filtersSlice.actions.setSearchText(e.target.value))}
                    />
                    <FaSearch size={15} style={{ marginLeft: '-25px', color: 'rgba(0,0,0,.2)' }} />
                </form>
                <div className="d-flex">
                    {
                        cart.cartDetails.length ? (
                            <Link to={'/cart'} className="position-relative me-3">
                                <FaShoppingCart size={20} className="me-2" role="button" />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cart.cartDetails.length}
                                </span>
                            </Link>
                        ) : (
                            <div>
                                <FaShoppingCart size={25} className="me-2" style={{color: 'Tomato'}}/>
                            </div>
                        )
                    }
                    <Link to={'/dashboard/order-list'}>
                        <FaUser size={20} role="button" />
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default Navbar;