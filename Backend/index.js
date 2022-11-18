const express = require('express');
const cors = require('cors');
require('./db/config');
const User = require('./db/User');
const Products = require('./db/Products');
const Jwt = require('jsonwebtoken')
const jwtKey = 'e-comm';
const app = express();


app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            resp.send({ result: 'somthing went wrong, Please try after sometime ' })
        }
        resp.send({ result, auth: token })
    })
})

app.post("/login", async (req, resp) => {
    console.log(req.body)
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select('-password');
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send({ result: 'somthing went wrong, Please try after sometime ' })
                }
                resp.send({ user, auth: token })
            })

        } else {
            resp.send({ result: 'no user found' })
        }
    } else {
        resp.send({ result: 'no user found' })
    }


})

app.post("/add-product", async (req, resp) => {
    let product = new Products(req.body);
    let result = await product.save();
    resp.send(result);
})

app.get('/products', async (req, resp) => {
    let products = await Products.find();
    if (products.length > 0) {
        resp.send(products)

    } else {
        resp.send({ result: "no result found" })
    }
})

app.delete('/product/:id', async (req, resp) => {
    const result = await Products.deleteOne({ _id: req.params.id });
    resp.send(result);
})

app.get('/product/:id', async (req, resp) => {
    let result = await Products.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)

    }
    else {
        resp.send({ result: "no record found" });
    }
})

app.put("/product/:id", async (req, resp) => {
    let result = await Products.updateOne({ _id: req.params.id },
        { $set: req.body })
    resp.send(result);
})

app.get("/search/:key", verifyToken, async (req, resp) => {
    let result = await Products.find(
        {
            "$or": [
                { name: { $regex: req.params.key } },
                { comapny: { $regex: req.params.key } },
                { category: { $regex: req.params.key } }

            ]
        })
    resp.send(result);
})

function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split('');
        console.warn("middleware called if", token)
    } else {

    }
    console.warn("middleware called", token)
    next();
}
app.listen(5000);