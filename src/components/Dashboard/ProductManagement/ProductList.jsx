import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaStar, FaTimes, FaTrash, FaUpload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loadingManageSelector, productPaginationSelector } from "../../../redux-toolkit/selectors";
import useFetchResource from "../../../custom-hooks/useFetchResource";
import { CATEGORY_API_URL, COLOR_API_URL, COMPANY_API_URL } from "../../../services/common";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from "react-toastify";
import EditProductModel from "./EditProductModel";
import { addNewProductThunkAction, fetchProductPaginationThunkAction, removeProductByIdThunkActon } from "../../../slices/manageProductSlice";
import Swal from 'sweetalert2';
import axios from 'axios'

const schema = yup.object({
    title: yup.string().required(),
    newPrice: yup.number().positive().required().typeError('price is a required field'),
    category: yup.string().required(),
    color: yup.string().required(),
    company: yup.string().required(),
    // img: yup.string().required(),
})

function ProductList() {
    const [openAddProductArea, setOpenAddProductArea] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [direction, setDirection] = useState('next')
    const [field, setField] = useState('id')
    const [order, setOrder] = useState('asc')
    const [temporaryPhoto, setTemporaryPhoto] = useState()
    const [selectFile, setSelectFile] = useState()
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()
    const loading = useSelector(loadingManageSelector)
    const { products, pagination } = useSelector(productPaginationSelector)
    useEffect(() => {
        dispatch(fetchProductPaginationThunkAction({
            _page: page,
            _limit: pageSize,
            _sort: field,
            _order: order
        }))
    }, [dispatch, page, pageSize, field, order])

    const companyList = useFetchResource(COMPANY_API_URL)
    const categoryList = useFetchResource(CATEGORY_API_URL)
    const colorList = useFetchResource(COLOR_API_URL)

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    })

    const [selectProduct, setSelectProduct] = useState({})

    const handleCloseAddProductArea = () => {
        setOpenAddProductArea(false)
        reset()
        setSelectFile()
        setTemporaryPhoto()
    }
    const handleAddNewProduct = (data) => {
        if (!data?.img) {
            Swal.fire({
                'title': 'Thông báo!',
                'text': 'Bạn cần thao tác load ảnh trước!'
            })
            return;
        }
        let newProduct = {
            ...data,
            prevPrice: 0,
            star: 0,
            reviews: 0
        }
        dispatch(addNewProductThunkAction(newProduct))
        reset()
        setSelectFile()
        setTemporaryPhoto()
        toast.success('Product added success!')
    }

    const handleSelectProduct = (product) => {
        setSelectProduct(product)
    }

    const handleNextPage = () => {
        if (page < pagination.totalPage) {
            setPage(page + 1)
            setDirection('next')
        }
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1)
            setDirection('prev')
        }
    }

    const handleChangePageSize = (e) => {
        setPageSize(Number(e.target.value))
        setPage(1)
        setDirection('next')
    }

    const handleRemoveProduct = (product) => {
        Swal.fire({
            title: "Confirm remove product",
            text: `Are you sure to remove product: ${product.title}?`,
            showCancelButton: true,
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(removeProductByIdThunkActon(product))
                toast(`Product ${product.title} removed success!`)
            }
        })
    }

    const handleSelectPhoto = (e) => {
        if (e.target.files[0]?.name) {
            const fake_photo = URL.createObjectURL(e.target.files[0])
            setTemporaryPhoto(fake_photo)
            setSelectFile(e.target.files[0])
        }
    }

    const handleUploadPhoto = async (e) => {
        e.stopPropagation()
        setUploading(true)
        const formData = new FormData();
        formData.append('file', selectFile)
        formData.append('upload_preset', 'lhih0wco')
        let uploadResult = await axios.post('https://api.cloudinary.com/v1_1/dikortveg/image/upload', formData)
        setTemporaryPhoto(uploadResult?.data?.secure_url)
        setValue('img', uploadResult?.data?.secure_url)
        toast.info('Photo uploaded success!')
        setUploading(false)
    }
    return (
        <div className="container">
            <EditProductModel selectProduct={selectProduct} setSelectProduct={setSelectProduct} />
            <div className="row product-title">
                <div className="col-lg-12 d-flex align-items-center justify-content-between">
                    <h5>Quản Lý Thông Tin Sản Phẩm</h5>
                    <button className="btn btn-warning btn-sm d-flex align-items-center"
                        onClick={() => setOpenAddProductArea(true)}
                    >
                        <FaPlus size={15} className="me-2" />
                        Thêm Sản Phẩm mới
                    </button>
                </div>
            </div>
            {
                openAddProductArea && (
                    <div className="product-form my-1">
                        <form onSubmit={handleSubmit(handleAddNewProduct)} className="row">
                            <div className="col-md-4">
                                <div className="form-group mb-2">
                                    <label className="form-label">Tên sản phẩm</label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-sm ${errors?.title?.message ? 'is-invalid' : ''}`}
                                        placeholder="Title"
                                        {...register('title')}
                                    />
                                    <span className="invalid-feedback">{errors?.title?.message}</span>
                                </div>
                                <div className="form-group mb-2">
                                    <label className="form-label">Đơn giá</label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-sm ${errors?.newPrice?.message ? 'is-invalid' : ''}`}
                                        placeholder="Price"
                                        {...register('newPrice')}
                                    />
                                    <span className="invalid-feedback">{errors?.newPrice?.message}</span>
                                </div>
                                <div className="form-group mb-2">
                                    <label className="form-label"></label>
                                    <div className="d-flex">
                                        <button type="submit" className="btn btn-success btn-sm flex-grow-1 me-2 d-flex align-items-center justify-content-center">
                                            <FaPlus className="me-2" />
                                            Thêm mới
                                        </button>
                                        <button type="button"
                                            onClick={handleCloseAddProductArea}
                                            className="btn btn-dark btn-sm flex-grow-1 d-flex align-items-center justify-content-center">
                                            <FaTimes className="me-2" />
                                            Đóng trang
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group mb-2">
                                    <label className="form-label">Phân loại</label>
                                    <select
                                        className={`form-select form-select-sm form-control-sm ${errors?.category?.message ? 'is-invalid' : ''}`}
                                        defaultValue={''}
                                        {...register('category')}
                                    >
                                        <option value={''} disabled>Hãy chọn phân loại</option>
                                        {
                                            categoryList?.map((cat) => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))
                                        }
                                    </select>
                                    <span className="invalid-feedback">{errors?.category?.message}</span>
                                </div>
                                <div className="form-group mb-2">
                                    <label className="form-label">Nhà cung cấp</label>
                                    <select
                                        className={`form-select form-select-sm form-control-sm ${errors?.company?.message ? 'is-invalid' : ''}`}
                                        defaultValue={''}
                                        {...register('company')}
                                    >
                                        <option value={''} disabled>Hãy chọn Nhà cung cấp</option>
                                        {
                                            companyList?.map((company) => (
                                                <option key={company.id} value={company.name}>{company.name}</option>
                                            ))
                                        }
                                    </select>
                                    <span className="invalid-feedback">{errors?.company?.message}</span>
                                </div>
                                <div className="form-group mb-2">
                                    <label className="form-label">Màu sắc</label>
                                    <select
                                        className={`form-select form-select-sm form-control-sm ${errors?.color?.message ? 'is-invalid' : ''}`}
                                        defaultValue={''}
                                        {...register('color')}
                                    >
                                        <option value={''} disabled>Hãy chọn màu</option>
                                        {
                                            colorList?.map((color) => (
                                                <option key={color.id} value={color.name}>{color.name}</option>
                                            ))
                                        }
                                    </select>
                                    <span className="invalid-feedback">{errors?.color?.message}</span>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="border-dashed w-100 h-100" onClick={() => document.getElementById('file-photo').click()}>
                                    {
                                        temporaryPhoto ? (
                                            <div role="button" className="d-flex flex-column align-items-center justify-content-between w-100 h-100 text-secondary">
                                                <img style={{ maxWidth: '90%', maxHeight: '70%' }} src={temporaryPhoto} alt="" />
                                                {
                                                    uploading ? (
                                                        <button type="button" className="btn btn-secondary btn-sm d-flex align-items-center mt-2" disabled>
                                                            <FaUpload className="me-3" />
                                                            Đang load thông tin...
                                                        </button>
                                                    ) : (
                                                        <button type="button" className="btn btn-secondary btn-sm d-flex align-items-center mt-2"
                                                            onClick={handleUploadPhoto}
                                                        >
                                                            <FaUpload className="me-3" />
                                                            Load thông tin
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        ) : (
                                            <div role="button" className="d-flex flex-column align-items-center justify-content-center w-100 h-100 text-secondary">
                                                <FaUpload size={50} className="mb-2" />
                                                <span className="text-decoration-underline">Chọn ảnh</span>
                                            </div>
                                        )
                                    }
                                    <input id="file-photo" type="file" accept="image/*" className="d-none"
                                        onChange={handleSelectPhoto}
                                    />
                                </div>
                            </div>
                        </form>
                    </div >
                )
            }
            <div className="row product-list">
                <div className="col-md-12 d-flex align-items-center my-2">
                    <div className="d-flex align-items-center">
                        <span className="me-2">Lọc</span>
                        <select className="form-select form-select-sm" defaultValue={'id'}
                            onChange={(e) => setField(e.target.value)}
                        >
                            <option value={'id'}>Mã sản phẩm</option>
                            <option value={'title'}>Tên sản phẩm</option>
                            <option value={'category'}>Phân loại</option>
                            <option value={'color'}>Màu sắc</option>
                            <option value={'company'}>Nhà cung cấp</option>
                        </select>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="mx-3 my-4">Xếp</span>
                        <select className="form-select form-select-sm" defaultValue={'asc'}
                            onChange={(e) => setOrder(e.target.value)}
                        >
                            <option value={'asc'}>Tăng dần</option>
                            <option value={'desc'}>Giảm dần</option>
                        </select>
                    </div>
                </div>
                {
                    loading === 'loading' ? <p style={{color: 'red'}}>Đang tải trang...</p> : (
                        <table className="table table-striped product-table">
                            <thead>
                                <tr>
                                    <th className="text-center">Tên sản phẩm</th>
                                    <th className="text-start">Màu sắc</th>
                                    <th className="text-start">Phân loại</th>
                                    <th className="text-start">Nhà cung cấp</th>
                                    <th className="text-end">Đơn giá</th>
                                    <th className="text-center">Xếp hạng</th>
                                    <th className="text-center">Cập nhật</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    products?.map((product) => (
                                        <tr key={product.id}>
                                            <td className="text-start align-middle" style={{ minWidth: "250px" }}>
                                                <div className="d-flex align-items-center">
                                                    <img style={{ width: '50px' }} src={product.img} alt="" />
                                                    <span className="ms-2">{product.title}</span>
                                                </div>
                                            </td>
                                            <td className="text-start align-middle">
                                                <span
                                                    className={`badge px-2 py-1 ${product.color === 'White' ? 'border text-black' : ''}`}
                                                    style={{ backgroundColor: product.color }}
                                                >{product.color}</span>
                                            </td>
                                            <td className="text-start align-middle">
                                                {product.category}
                                            </td>
                                            <td className="text-start align-middle">
                                                {product.company}
                                            </td>
                                            <td className="text-end align-middle">
                                                <div className="d-flex flex-column">
                                                    <del>{product.prevPrice}đ</del>
                                                    <span>{product.newPrice}đ</span>
                                                </div>
                                            </td>
                                            <td className="text-center align-middle">
                                                <div className="d-flex flex-column align-items-center justify-content-center">
                                                    <div className="d-flex align-items-center">
                                                        <span className="me-1">{product.star}</span>
                                                        <FaStar color="yellow" />
                                                    </div>
                                                    <div>
                                                        <span className="me-1">{product.reviews}</span>
                                                        <FaEye color="green" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center align-middle">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <FaEdit className="text-success me-1" role="button"
                                                        onClick={() => handleSelectProduct(product)}
                                                    />
                                                    <FaTrash className="text-danger" role="button" onClick={() => handleRemoveProduct(product)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    )
                }
                <div className="d-flex align-items-center justify-content-between">
                    <ul className="pagination my-0">
                        <li className={`page-item ${direction === 'prev' ? 'active' : ''} ${page <= 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={handlePreviousPage}>Trang trước</button>
                        </li>
                        <li className={`page-item ${direction === 'next' ? 'active' : ''} ${page >= pagination.totalPage ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={handleNextPage}>Trang kế</button>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center">
                        <span style={{ width: '120px' }}>Số mục mỗi trang</span>
                        <select style={{ width: '50px' }} className="form-control" defaultValue={10}
                            onChange={handleChangePageSize}
                        >
                            <option value={10}>10</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ProductList;