import React from "react";
import { useDispatch, useSelector } from "react-redux";
import filtersSlice from './../../slices/filtersSlice';
import { priceSelector } from "../../redux-toolkit/selectors";

const prices = [
    {
        value: '0,0',
        name: "All"
    },
    {
        value: '0,11000',
        name: "0 - < 12000đ"
    },
    {
        value: '12000,14000',
        name: "12000đ - < 15000đ"
    },
    {
        value: '15000,19000',
        name: "15000đ - < 20000đ"
    },
    {
        value: '20000,25000',
        name: "> = 20000đ"
    },

]
function Price() {
    const currentPrice = useSelector(priceSelector)
    const dispatch = useDispatch()
    return (
        <div className="py-2 d-flex flex-column justify-content-center">
            <h5>Đơn Giá</h5>
            <div className="form-group">
                {
                    prices.map((price,index) => (
                        <div key={price.value} className="form-check py-1">
                            <input className="form-check-input" type="radio" name="price"
                                id={`price_${index}`}
                                value={price.value}
                                defaultChecked={price.value === 'All'}
                                onChange={(e) => dispatch(filtersSlice.actions.setSearchPrice(e.target.value))}
                            />
                            <label 
                                className={`form-check-label ${price.value === currentPrice ? 'text-decoration-underline fw-bolder' : ''}`}
                                htmlFor={`price_${index}`}
                                role="button"
                            >
                                {price.name}
                            </label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Price;