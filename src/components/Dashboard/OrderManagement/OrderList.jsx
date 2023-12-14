import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderListThunkAction } from "../../../slices/orderSlice";
import { orderListSelector, orderLoadingSelector } from "../../../redux-toolkit/selectors";
import { MdReadMore } from "react-icons/md";
import dayjs from "dayjs";

function OrderList() {
    const [selectOrder, setSelectOrder] = useState(null)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchOrderListThunkAction())
    }, [dispatch])
    const orderList = useSelector(orderListSelector)
    const loading = useSelector(orderLoadingSelector)

    console.log(orderList);
    return (
        <div className="container">
            <div className="row">
                <div className={`${selectOrder ? 'col-md-7' : 'col-md-12'}`}>
                    <h5>Chi Tiết Đơn Hàng</h5>
                    {
                        loading === 'loading' ? <p style={{color: 'red'}}>Đang tải trang...</p> : (
                            <table className="table table-striped order-table">
                                <thead>
                                    <tr>
                                        <th className="text-end align-middle">Ngày đặt</th>
                                        <th className="text-end align-middle">Số lượng</th>
                                        <th className="text-end align-middle">Thành tiền</th>
                                        <th className="text-end align-middle">Phí giao hàng</th>
                                        <th className="text-end align-middle">Tổng tiền</th>
                                        <th className="text-end align-middle">Trạng thái</th>
                                        <th className="text-start align-middle">Tên Khách hàng</th>
                                        <th className="text-end align-middle">Xem Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orderList?.map((order) => (
                                            <tr key={order.orderId}>
                                                <td className="text-end align-middle">{dayjs(order.orderInfo.orderDate).format('MMM DD YYYY')}</td>
                                                <td className="text-end align-middle">
                                                    {order.orderDetails.length}
                                                </td>
                                                <td className="text-end align-middle">
                                                    {order?.orderInfo?.subTotal}đ
                                                </td>
                                                <td className="text-end align-middle">
                                                    {`${order?.orderInfo?.shipping ? 'đ' + order?.orderInfo?.shipping : 'Free'}`}
                                                </td>
                                                <td className="text-end align-middle">
                                                    {order?.orderInfo?.total}đ
                                                </td>
                                                <td className="text-end align-middle">
                                                    <span className="badge bg-secondary">{order?.orderInfo?.status}</span>
                                                </td>
                                                <td className="text-start align-middle">
                                                    {order?.customerInfo?.fullname}
                                                </td>
                                                <td className="text-end align-middle">
                                                    <MdReadMore size={20} color="green" role="button"
                                                        onClick={() => setSelectOrder(order)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        )
                    }
                </div>
                {
                    selectOrder &&
                    <div className="col-lg-5 border p-2 rounded">
                        <div className="d-flex align-items-center justify-content-between border-bottom">
                            <h5>Order details</h5>
                            <span role="button" className="btn-close" onClick={() => setSelectOrder(null)}></span>
                        </div>
                        <div className="my-2 border-bottom">
                            <h6>Order Information</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal</span>
                                <span className="fw-bolder">{selectOrder?.orderInfo?.subTotal}đ</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Shipping</span>
                                <span className="fw-bolder">
                                    {`${selectOrder?.orderInfo?.shipping ? 'đ' + selectOrder?.orderInfo?.shipping : 'Miễn phí'}`}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total</span>
                                <span className="fw-bolder">{selectOrder?.orderInfo?.total}đ</span>
                            </div>
                        </div>
                        <div className="my-2 border-bottom">
                            <h6>Customer Information</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Fullname</span>
                                <span className="fw-bolder">{selectOrder?.customerInfo?.fullname}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Email</span>
                                <span className="fw-bolder">{selectOrder?.customerInfo?.email}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Mobile</span>
                                <span className="fw-bolder">{selectOrder?.customerInfo?.mobile}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Address</span>
                                <span className="fw-bolder">{selectOrder?.customerInfo?.address}</span>
                            </div>
                        </div>
                        <div className="my-2 border-bottom">
                            <h6>Order details</h6>
                            <table className="table table-striped">
                                <tbody>
                                    {
                                        selectOrder?.orderDetails?.map((orderItem) => (
                                            <tr key={orderItem.id}>
                                                <td style={{width: "250px"}}>
                                                    <div className="d-flex align-items-center">
                                                        <img style={{width: '50px'}} className="me-2" src={orderItem?.img} alt=""/>
                                                        {orderItem?.title}
                                                    </div>
                                                </td>
                                                <td className="text-end align-middle">{orderItem?.quantity}</td>
                                                <td className="text-end align-middle">{orderItem?.newPrice}đ</td>
                                                <td className="text-end align-middle fw-bolder">{orderItem?.amount}đ</td>

                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default OrderList;