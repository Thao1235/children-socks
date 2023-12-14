import React from "react";
import { useDispatch, useSelector } from "react-redux";
import filtersSlice from "../../slices/filtersSlice";
import { colorSelector } from "../../redux-toolkit/selectors";

const colors = [
    "All", "Black", "Blue", "Red", "Green", "Pink", "White", "Yellow"
]
function Colors() { 
    const currentColor = useSelector(colorSelector)
    const dispatch = useDispatch()
    return (
        <div className="py-2 d-flex flex-column justify-content-center">
            <h5>Màu Sắc</h5>
            <div className="form-group">
                {
                    colors.map((color, index) => (
                        <div key={color} className="form-check py-1">
                            <input className="form-check-input" type="radio" name="color"
                            id={`color_${index}`}
                                value={color}
                                defaultChecked={color === 'All'}
                                style={color === 'All' ? { backgroundImage: 'linear-gradient(to right, red, green)' } : color !== 'White' ? { backgroundColor: color } : {}}
                                onChange={(e) => dispatch(filtersSlice.actions.setSearchColor(e.target.value))}
                            />
                            <label 
                                className={`form-check-label ${color === currentColor ? 'text-decoration-underline fw-bolder' : ''}`}
                                htmlFor={`color_${index}`}
                                role="button"
                            >
                                {color}
                            </label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Colors;