import React from "react";
import MainLayout from "../layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { cartSelector } from "../redux-toolkit/selectors";
import cartSlice, { checkoutThunkAction } from './../slices/cartSlice';
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { v4 as uuid } from "uuid";

const schema = yup.object({
    fullname: yup.string().required(),
    address: yup.string().required(),
    email: yup.string().required(),
    mobile: yup.string().required()
})

function CartPage() {
    const cart = useSelector(cartSelector)
    const dispatch = useDispatch()
    const { cartInfo, cartDetails } = cart

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const handleIncrementQuantity = (cartItem) => {
        dispatch(cartSlice.actions.incrementQuantity(cartItem))
        toast.success(`${cartItem.title} has increment quantity`)
    }
    const handleDescrementQuantity = (cartItem) => {
        dispatch(cartSlice.actions.descrementQuantity(cartItem))
        toast.success(`${cartItem.title} has descrement quantity`)
    }

    const handleRemoveCartItem = (cartItem) => {
        Swal.fire({
            title: "Confirm remove cart item",
            text: 'Are you sure to remove this cart item',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(cartSlice.actions.removeCartItem(cartItem))
                toast.info(`${cartItem.title} has been removed`)
            }
        })
    }

    const handleCheckoutCart = (data) => {
        Swal.fire({
            title: "Confirm checkout",
            text: 'Are you sure checkout',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: "Confirm"
        }).then((result) => {
            if (result.isConfirmed) {
                const order = {
                    orderId: uuid(),
                    orderInfo: {
                        ...cartInfo,
                        orderDate: Math.floor(Date.now() / 1000)
                    },
                    orderDetails: [...cartDetails],
                    customerInfo: {
                        ...data
                    }
                }
                dispatch(checkoutThunkAction(order))
                reset()
                toast.success('Đơn hàng xác nhận thành công')
            }
        })
    }
    return (
        <MainLayout>
            <div className="container mt-1">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className=" py-2">Chi tiết đặt hàng</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-8">
                        <table className="table cart-table">
                            <thead>
                                <tr>Tên sản phẩm
                                    <th className="text-end">Đơn giá</th>
                                    <th className="text-center">Số lượng</th>
                                    <th className="text-end">Thành tiền</th>
                                    <th className="text-center">Huỷ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartDetails?.map((cartItem) => (
                                        <tr key={cartItem.id}>
                                            <td style={{ maxWidth: '200px' }}>
                                                <div className="d-flex align-items-center">
                                                    <img className="product-image" src={cartItem.img} alt="" />
                                                    <div className="d-inline">
                                                        <div className="d-block fw-bolder mb-2">{cartItem.title}</div>
                                                        <div className="badge py-2" style={{ backgroundColor: cartItem.color }}>{cartItem.color}</div>
                                                    </div>
                                                </div>

                                            </td>
                                            <td className="text-end">
                                                {cartItem.newPrice}đ
                                            </td>
                                            <td >
                                                <div className="cart-quantity-wrap">
                                                    <div className="cart-quantity">
                                                        {
                                                            cartItem.quantity > 1 ? (
                                                                <span onClick={() => handleDescrementQuantity(cartItem)}>-</span>
                                                            ) : (
                                                                <span>-</span>
                                                            )
                                                        }

                                                        <span>{cartItem.quantity}</span>
                                                        <span
                                                            onClick={() => handleIncrementQuantity(cartItem)}
                                                        >+</span>
                                                    </div>
                                                </div>

                                            </td>
                                            <td className="text-end">
                                                {cartItem.amount}đ
                                            </td>
                                            <td>
                                                <div className="action-wrap">
                                                    <span className="btn-remove"
                                                        onClick={() => handleRemoveCartItem(cartItem)}
                                                    >&times;</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <div className="row col-md-12">
                            <Link to={'/main'}>
                                <FaArrowLeft /> Tiếp tục đặt hàng
                            </Link>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-4" style={{ minWidth: '300px' }}>
                        <form onSubmit={handleSubmit(handleCheckoutCart)}>
                            <div className="order-summary p-3">
                                <h3 className="border-bottom py-2">Tổng tiền đơn hàng</h3>
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center justify-content-between py-2">
                                        <span>Thành tiền</span>
                                        <span className="fw-bolder">{cartInfo.subTotal}đ</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between py-2">
                                        <span>Phí giao hàng</span>
                                        <span className="fw-bolder">{`${cartInfo.shipping ? 'đ' + cartInfo.shipping : 'Miền phí'}`}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between border-top mt-2 py-2">
                                    <span className="fs-6">Tổng tiền đơn hàng</span>
                                    <span className="fw-bolder fs-6">{cartInfo.total}đ</span>
                                </div>
                            </div>
                            <div className="customer-info p-3">
                                <h3 className="border-bottom py-2">Thông tin giao hàng</h3>
                                <div className="form-group mb-3">
                                    <label className="form-label">Họ Tên khách hàng</label>
                                    <input type="text"
                                        className={`form-control ${errors?.fullname?.message ? 'is-invalid' : ''}`}
                                        placeholder="Fullname"
                                        {...register('fullname')}
                                    />
                                    <span className="invalid-feedback">{errors?.fullname?.message}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Địa chỉ</label>
                                    <input type="text"
                                        className={`form-control ${errors?.address?.message ? 'is-invalid' : ''}`}
                                        placeholder="Address"
                                        {...register('address')}
                                    />
                                    <span className="invalid-feedback">{errors?.address?.message}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="text"
                                        className={`form-control ${errors?.email?.message ? 'is-invalid' : ''}`}
                                        placeholder="Email"
                                        {...register('email')}
                                    />
                                    <span className="invalid-feedback">{errors?.email?.message}</span>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Số di động</label>
                                    <input type="text"
                                        className={`form-control ${errors?.mobile?.message ? 'is-invalid' : ''}`}
                                        placeholder="Mobile"
                                        {...register('mobile')}
                                    />
                                    <span className="invalid-feedback">{errors?.mobile?.message}</span>
                                </div>
                            </div>
                            <div className="py-3 bg-success mt-2 d-flex align-items-center justify-content-center text-white btn-checkout">
                                <button className="btn btn-block" type="submit">XÁC NHẬN ĐƠN HÀNG</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default CartPage;