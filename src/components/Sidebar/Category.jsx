import React from "react";
import { useDispatch, useSelector } from "react-redux";
import filtersSlice from "../../slices/filtersSlice";
import { colorSelector } from "../../redux-toolkit/selectors";

const categories = [
    "All", "Tất Bé gái 5-10 tuổi", "Tất Bé trai 5-10 tuổi", "Tất Bé trai-gái 5-10 tuổi", "Tất Bé dưới 5 tuổi"
]
function Category() {
    const category = useSelector(colorSelector)
    const dispatch = useDispatch()
    return (
        <div className="py-2 d-flex flex-column justify-content-center">
            <h5>Phân Loại</h5>
            <div className="form-group">
                {
                    categories.map((cat, index) => (
                        <div key={cat} className="form-check py-1">
                            <input className="form-check-input" type="radio" name="category"
                            id={`cat_${index}`}
                                value={cat}
                                defaultChecked={cat === 'All'}
                                onChange={(e) => dispatch(filtersSlice.actions.setSearchCategory(e.target.value))}
                            />
                            <label 
                                className={`form-check-label ${cat === category ? 'text-decoration-underline fw-bolder' : ''}`}
                                htmlFor={`cat_${index}`}
                                role="button"
                            >
                                {cat}
                            </label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Category;