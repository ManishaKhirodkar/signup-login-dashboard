import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getProductDetails();
    }, [])

    const getProductDetails = async () => {
        console.warn(params);
        let result = await fetch(`http://localhost:5000/product/${params.id}`);
        result = await result.json();
        setName(result.name)
        setPrice(result.price)
        setCategory(result.category)
        setCompany(result.company)
    }

    const updateProduct = async () => {
        console.warn(name, price, category, company);
        let result = await fetch(`http://localhost:5000/product/${params.id}`,{
            method: "put",
            body: JSON.stringify({ name, price, company, category }),
            headers: { "content-type": "application/json" }
        });
        result = await result.json()
        console.warn(result);
        navigate('/')
    }
    return (
        <div className='product'>
            <h1>Update products</h1>
            <input type="text" onChange={(e) => { setName(e.target.value) }}
                value={name} className='inputBox' placeholder='Enter product name' />

            <input type="text" onChange={(e) => { setPrice(e.target.value) }}
                value={price} className='inputBox' placeholder='Enter product price' />

            <input type="text" onChange={(e) => { setCategory(e.target.value) }}
                value={category} className='inputBox' placeholder='Enter product category' />

            <input type="text" onChange={(e) => { setCompany(e.target.value) }}
                value={company} className='inputBox' placeholder='Enter product company' />

            <button onClick={updateProduct} className='appbutton'>Update Product</button>
        </div>
    )
}

export default UpdateProduct;