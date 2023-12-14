import React, { useEffect, useState } from "react";
import { FaExchangeAlt, FaSave, FaUndo, FaUpload } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import useFetchResource from "../../../custom-hooks/useFetchResource";
import { CATEGORY_API_URL, COLOR_API_URL, COMPANY_API_URL } from "../../../services/common";
import { useDispatch } from "react-redux";
import { editProductThunkAction } from "../../../slices/manageProductSlice";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

const schema = yup.object({
    title: yup.string().required(),
    newPrice: yup.number().positive().required().typeError('price is a required field'),
    category: yup.string().required(),
    color: yup.string().required(),
    company: yup.string().required(),
    img: yup.string().required(),
})

function EditProductModel({ selectProduct, setSelectProduct }) {
    const companyList = useFetchResource(COMPANY_API_URL)
    const categoryList = useFetchResource(CATEGORY_API_URL)
    const colorList = useFetchResource(COLOR_API_URL)
    const [currenProduct, setCurrentProduct] = useState({})
    const [loading, setLoading] = useState(false)
    const [temporayChangePhoto, setTemporaryChangePhoto] = useState()
    const [selectedNewPhoto, setSelectedNewPhoto] = useState()
    const [reUploading, setReUploading] = useState(false)

    const dispatch = useDispatch()
    useEffect(() => {
        setLoading(true)
        async function getProductById() {
            let productRes = await fetch(`https://data-casestudy.onrender.com/products/${selectProduct?.id}`)
            let product = await productRes.json()
            setCurrentProduct(product)
            setLoading(false)
            setValue("title", product.title)
            setValue("newPrice", product.newPrice)
            setValue("category", product.category)
            setValue("color", product.color)
            setValue("company", product.company)
            setValue("img", product.img)
        }
        getProductById()
    }, [selectProduct?.id])

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema)
    })

    const handleCloseEditModel = () => {
        setSelectProduct({})
        reset()
        setSelectedNewPhoto()
        setTemporaryChangePhoto()
    }

    const handleSaveProduct = (data) => {
        if (selectedNewPhoto?.name) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Bạn cần thao tác load ảnh trước!'
            })
            return;
        }
        let editProduct = {
            ...currenProduct,
            ...data,
            prevPrice: Number(data.newPrice) !== Number(currenProduct.newPrice) ? currenProduct.newPrice : currenProduct.prevPrice
        }
        dispatch(editProductThunkAction(editProduct))
        toast.success('Product updated success')
        setSelectProduct({})
    }

    const handleChangePhoto = (e) => {
        if (e.target.files[0]?.name) {
            const fake_photo_url = URL.createObjectURL(e.target.files[0])
            setTemporaryChangePhoto(fake_photo_url)
            setSelectedNewPhoto(e.target.files[0])
        }
    }

    const handleReUploadPhoto = async (e) => {
        e.stopPropagation()
        if (selectedNewPhoto?.name) {
            setReUploading(true)
            const formData = new FormData();
            formData.append('file', selectedNewPhoto)
            formData.append('upload_preset', 'lhih0wco')
            let uploadResult = await axios.post('https://api.cloudinary.com/v1_1/dikortveg/image/upload', formData)
            setTemporaryChangePhoto(uploadResult?.data?.secure_url)
            setValue('img', uploadResult?.data?.secure_url)
            toast.info('Ảnh load thành công!')
            setSelectedNewPhoto()
            setReUploading(false)
            return
        }
        Swal.fire({
            title: 'Thông báo',
            text: 'Ảnh đã có trong thư viện, hãy load ảnh mới!'
        })
    }

    return (
        <>
            <div className="modal fade show" style={{ display: `${selectProduct?.id ? 'block' : 'none'}` }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(handleSaveProduct)}>
                            <div className="modal-header">
                                <h5 className="modal-title">Modify Product</h5>
                                <button type="button" className="btn-close" onClick={handleCloseEditModel} />
                            </div>
                            <div className="modal-body">
                                {
                                    loading ? <p>Đang tải trang...</p> : (
                                        <div className="row">
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
                                                    <label className="form-label">Màu sắc</label>
                                                    <select
                                                        className={`form-select form-select-sm ${errors?.color?.message ? 'is-invalid' : ''}`}
                                                        defaultValue={''}
                                                        {...register('color')}
                                                    >
                                                        <option value={''} disabled>Hãy chọn màu đúng</option>
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
                                                <div className="form-group mb-2">
                                                    <label className="form-label">Phân loại</label>
                                                    <select
                                                        className={`form-select form-select-sm ${errors?.category?.message ? 'is-invalid' : ''}`}
                                                        defaultValue={''}
                                                        {...register('category')}
                                                    >
                                                        <option value={''} disabled>Hãy chọn phân loại đúng</option>
                                                        {
                                                            categoryList?.map((cat) => (
                                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <span className="invalid-feedback">{errors?.category?.message}</span>
                                                </div>
                                                <div className="form-group mb-2">
                                                    <label className="form-label">Nhà Cung Cấp</label>
                                                    <select
                                                        className={`form-select form-select-sm ${errors?.company?.message ? 'is-invalid' : ''}`}
                                                        defaultValue={''}
                                                        {...register('company')}
                                                    >
                                                        <option value={''} disabled>Hãy chọn nhà cung cấp</option>
                                                        {
                                                            companyList?.map((company) => (
                                                                <option key={company.id} value={company.name}>{company.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <span className="invalid-feedback">{errors?.company?.message}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="border-dashed d-flex flex-column align-items-center justify-content-between w-100 h-100">
                                                    <img style={{ maxWidth: '90%', maxHeight: '70%' }} src={temporayChangePhoto || currenProduct?.img} alt="" />
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        {
                                                            temporayChangePhoto && (<button type="button" className="btn btn-sm btn-primary me-3"
                                                                onClick={handleReUploadPhoto} {...`${reUploading ? 'disabled' : ''}`}
                                                            >
                                                                <FaUpload className="me-2" />
                                                                {`${reUploading ? 'Uploading...' : 'Upload'}`}
                                                            </button>)
                                                        }
                                                        <button type="button" className="btn btn-sm btn-secondary" onClick={() => document.getElementById('file-change-photo').click()}>
                                                            <FaExchangeAlt className="me-2" />
                                                            Thay đổi hình nền
                                                        </button>
                                                    </div>
                                                    <input id="file-change-photo" type="file" accept="image/*" className="d-none"
                                                        onChange={handleChangePhoto}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark d-flex align-items-center"
                                    onClick={handleCloseEditModel}
                                >
                                    <FaUndo className="me-2" />
                                    Huỷ thay đổi
                                </button>
                                <button type="submit" className="btn btn-success d-flex align-items-center">
                                    <FaSave className="me-2" />
                                    Cập nhật mới
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            </div >
        </>
    )
}

export default EditProductModel;