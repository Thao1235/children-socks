import React from "react";
import { useDispatch, useSelector } from "react-redux";
import filtersSlice from "../../slices/filtersSlice";
import { recommendedSelector } from "../../redux-toolkit/selectors";

const recommendedList = [
    {
        value: 'All',
        name: 'Tổ hợp sản phẩm'
    },
    {
        value: 'Thanh Cong Garment',
        name: 'Thanh Cong Garment'
    },
    {
        value: 'Thanh Loi Co Ltd',
        name: 'Thanh Loi Co Ltd'
    },
    {
        value: 'Dan Le Baby Shop',
        name: 'Dan Le Baby Shop'
    },
    {
        value: 'Saigon Coop',
        name: 'Saigon Coop'
    },
    {
        value: 'Small Star Shop',
        name: 'Small Star Shop'
    },
    {
        value: 'Sun Flower Shop',
        name: 'Sun Flower Shop'
    }
]
function Recommended() {
    const recommended = useSelector(recommendedSelector)
    const dispatch = useDispatch()
    return (
        <div className="py-2 d-flex flex-column justify-content-center">
            <h5 style={{color: 'blue'}}>Nhà Cung Cấp</h5>
            <div className="form-group">
                {
                    recommendedList.map(recmd => (
                        <button key={recmd.value}
                            className={
                                `btn btn-sm btn-outline-secondary me-1
                                    ${recmd.value === recommended ? 'active' : ''}
                                `
                            }
                            type="button"
                            onClick={() => dispatch(filtersSlice.actions.setSearchRecommended(recmd.value))}
                        >
                            {recmd.name}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default Recommended;