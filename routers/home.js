const express = require("express");
const router = express.Router();
const connection = require("../utils/db");


// 選套組一資料
// http://localhost:3002/api/home/suit-one
router.get("/suit-one", async (req, res, next) => {
    let [data] = await connection.execute(
        "SELECT * FROM suits LEFT JOIN products ON suits.suit_product = products.product_no WHERE suits.suit_group = ? ORDER BY suits.suit_order",
        [1]
    );

    // 轉換data
    const suitOneDataA = data.map((v,i)=>{
        return {
            noA: v.product_no,
            nameA: v.name,
            priceA: v.price,
            imgA: v.image1,           
        };
    })

    const suitOneDataB = data.map((v,i)=>{
        return {
            noB: v.product_no,
            nameB: v.name,
            priceB: v.price,
            imgB: v.image1,           
        };
    })

    const suitOneDataC = data.map((v,i)=>{
        return {
            noC: v.product_no,
            nameC: v.name,
            priceC: v.price,
            imgC: v.image1,           
        };
    })

    const suitOneDataD = data.map((v,i)=>{
        return {
            noD: v.product_no,
            nameD: v.name,
            priceD: v.price,
            imgD: v.image1,           
        };
    })

    const suitOneDataE = data.map((v,i)=>{
        return {
            noE: v.product_no,
            nameE: v.name,
            priceE: v.price,
            imgE: v.image1,           
        };
    })

    const suitOneDataF = data.map((v,i)=>{
        return {
            noF: v.product_no,
            nameF: v.name,
            priceF: v.price,
            imgF: v.image1,           
        };
    })

    let midData = [
        suitOneDataA[0], suitOneDataB[1], suitOneDataC[2], suitOneDataD[3], suitOneDataE[4], suitOneDataF[5]
    ];

    let newObj = {};
    midData.forEach((v, i) =>{
        newObj = { ...newObj, ...v };
    })

    let newData = [newObj];
    
    // console.log(newData);
    res.json(newData);
});

// 選套組二資料
// http://localhost:3002/api/home/suit-two
router.get("/suit-two", async (req, res, next) => {
    let [data] = await connection.execute(
        "SELECT * FROM suits LEFT JOIN products ON suits.suit_product = products.product_no WHERE suits.suit_group = ? ORDER BY suits.suit_order",
        [2]
    );

    // 轉換data
    const suitOneDataA = data.map((v,i)=>{
        return {
            noA: v.product_no,
            nameA: v.name,
            priceA: v.price,
            imgA: v.image1,           
        };
    })

    const suitOneDataB = data.map((v,i)=>{
        return {
            noB: v.product_no,
            nameB: v.name,
            priceB: v.price,
            imgB: v.image1,           
        };
    })

    const suitOneDataC = data.map((v,i)=>{
        return {
            noC: v.product_no,
            nameC: v.name,
            priceC: v.price,
            imgC: v.image1,           
        };
    })

    const suitOneDataD = data.map((v,i)=>{
        return {
            noD: v.product_no,
            nameD: v.name,
            priceD: v.price,
            imgD: v.image1,           
        };
    })

    const suitOneDataE = data.map((v,i)=>{
        return {
            noE: v.product_no,
            nameE: v.name,
            priceE: v.price,
            imgE: v.image1,           
        };
    })

    const suitOneDataF = data.map((v,i)=>{
        return {
            noF: v.product_no,
            nameF: v.name,
            priceF: v.price,
            imgF: v.image1,           
        };
    })

    let midData = [
        suitOneDataA[0], suitOneDataB[1], suitOneDataC[2], suitOneDataD[3], suitOneDataE[4], suitOneDataF[5]
    ];

    let newObj = {};
    midData.forEach((v, i) =>{
        newObj = { ...newObj, ...v };
    })

    let newData = [newObj];
    
    // console.log(newData);
    res.json(newData);
});

// 選套組三資料
// http://localhost:3002/api/home/suit-three
router.get("/suit-three", async (req, res, next) => {
    let [data] = await connection.execute(
        "SELECT * FROM suits LEFT JOIN products ON suits.suit_product = products.product_no WHERE suits.suit_group = ? ORDER BY suits.suit_order",
        [3]
    );

    // 轉換data
    const suitOneDataA = data.map((v,i)=>{
        return {
            noA: v.product_no,
            nameA: v.name,
            priceA: v.price,
            imgA: v.image1,           
        };
    })

    const suitOneDataB = data.map((v,i)=>{
        return {
            noB: v.product_no,
            nameB: v.name,
            priceB: v.price,
            imgB: v.image1,           
        };
    })

    const suitOneDataC = data.map((v,i)=>{
        return {
            noC: v.product_no,
            nameC: v.name,
            priceC: v.price,
            imgC: v.image1,           
        };
    })

    const suitOneDataD = data.map((v,i)=>{
        return {
            noD: v.product_no,
            nameD: v.name,
            priceD: v.price,
            imgD: v.image1,           
        };
    })

    const suitOneDataE = data.map((v,i)=>{
        return {
            noE: v.product_no,
            nameE: v.name,
            priceE: v.price,
            imgE: v.image1,           
        };
    })

    const suitOneDataF = data.map((v,i)=>{
        return {
            noF: v.product_no,
            nameF: v.name,
            priceF: v.price,
            imgF: v.image1,           
        };
    })

    let midData = [
        suitOneDataA[0], suitOneDataB[1], suitOneDataC[2], suitOneDataD[3], suitOneDataE[4], suitOneDataF[5]
    ];

    let newObj = {};
    midData.forEach((v, i) =>{
        newObj = { ...newObj, ...v };
    })

    let newData = [newObj];
    
    // console.log(newData);
    res.json(newData);
});

// 選套組四資料
// http://localhost:3002/api/home/suit-four
router.get("/suit-four", async (req, res, next) => {
    let [data] = await connection.execute(
        "SELECT * FROM suits LEFT JOIN products ON suits.suit_product = products.product_no WHERE suits.suit_group = ? ORDER BY suits.suit_order",
        [4]
    );


    // 轉換data
    const suitOneDataA = data.map((v,i)=>{
        return {
            noA: v.product_no,
            nameA: v.name,
            priceA: v.price,
            imgA: v.image1,           
        };
    })

    const suitOneDataB = data.map((v,i)=>{
        return {
            noB: v.product_no,
            nameB: v.name,
            priceB: v.price,
            imgB: v.image1,           
        };
    })

    const suitOneDataC = data.map((v,i)=>{
        return {
            noC: v.product_no,
            nameC: v.name,
            priceC: v.price,
            imgC: v.image1,           
        };
    })

    const suitOneDataD = data.map((v,i)=>{
        return {
            noD: v.product_no,
            nameD: v.name,
            priceD: v.price,
            imgD: v.image1,           
        };
    })

    const suitOneDataE = data.map((v,i)=>{
        return {
            noE: v.product_no,
            nameE: v.name,
            priceE: v.price,
            imgE: v.image1,           
        };
    })

    const suitOneDataF = data.map((v,i)=>{
        return {
            noF: v.product_no,
            nameF: v.name,
            priceF: v.price,
            imgF: v.image1,           
        };
    })

    let midData = [
        suitOneDataA[0], suitOneDataB[1], suitOneDataC[2], suitOneDataD[3], suitOneDataE[4], suitOneDataF[5]
    ];

    let newObj = {};
    midData.forEach((v, i) =>{
        newObj = { ...newObj, ...v };
    })

    let newData = [newObj];
    
    // console.log(newData);
    res.json(newData);
});

// 選套組五資料
// http://localhost:3002/api/home/suit-five
router.get("/suit-five", async (req, res, next) => {
    let [data] = await connection.execute(
        "SELECT * FROM suits LEFT JOIN products ON suits.suit_product = products.product_no WHERE suits.suit_group = ? ORDER BY suits.suit_order",
        [5]
    );

    // 轉換data
    const suitOneDataA = data.map((v,i)=>{
        return {
            noA: v.product_no,
            nameA: v.name,
            priceA: v.price,
            imgA: v.image1,           
        };
    })

    const suitOneDataB = data.map((v,i)=>{
        return {
            noB: v.product_no,
            nameB: v.name,
            priceB: v.price,
            imgB: v.image1,           
        };
    })

    const suitOneDataC = data.map((v,i)=>{
        return {
            noC: v.product_no,
            nameC: v.name,
            priceC: v.price,
            imgC: v.image1,           
        };
    })

    const suitOneDataD = data.map((v,i)=>{
        return {
            noD: v.product_no,
            nameD: v.name,
            priceD: v.price,
            imgD: v.image1,           
        };
    })

    const suitOneDataE = data.map((v,i)=>{
        return {
            noE: v.product_no,
            nameE: v.name,
            priceE: v.price,
            imgE: v.image1,           
        };
    })

    const suitOneDataF = data.map((v,i)=>{
        return {
            noF: v.product_no,
            nameF: v.name,
            priceF: v.price,
            imgF: v.image1,           
        };
    })

    let midData = [
        suitOneDataA[0], suitOneDataB[1], suitOneDataC[2], suitOneDataD[3], suitOneDataE[4], suitOneDataF[5]
    ];

    let newObj = {};
    midData.forEach((v, i) =>{
        newObj = { ...newObj, ...v };
    })

    let newData = [newObj];
    
    // console.log(newData);
    res.json(newData);
});

// 選套組六資料
// http://localhost:3002/api/home/suit-six
router.get("/suit-six", async (req, res, next) => {
    let [data] = await connection.execute(
        "SELECT * FROM suits LEFT JOIN products ON suits.suit_product = products.product_no WHERE suits.suit_group = ? ORDER BY suits.suit_order",
        [6]
    );

    // 轉換data
    const suitOneDataA = data.map((v,i)=>{
        return {
            noA: v.product_no,
            nameA: v.name,
            priceA: v.price,
            imgA: v.image1,           
        };
    })

    const suitOneDataB = data.map((v,i)=>{
        return {
            noB: v.product_no,
            nameB: v.name,
            priceB: v.price,
            imgB: v.image1,           
        };
    })

    const suitOneDataC = data.map((v,i)=>{
        return {
            noC: v.product_no,
            nameC: v.name,
            priceC: v.price,
            imgC: v.image1,           
        };
    })

    const suitOneDataD = data.map((v,i)=>{
        return {
            noD: v.product_no,
            nameD: v.name,
            priceD: v.price,
            imgD: v.image1,           
        };
    })

    const suitOneDataE = data.map((v,i)=>{
        return {
            noE: v.product_no,
            nameE: v.name,
            priceE: v.price,
            imgE: v.image1,           
        };
    })

    const suitOneDataF = data.map((v,i)=>{
        return {
            noF: v.product_no,
            nameF: v.name,
            priceF: v.price,
            imgF: v.image1,           
        };
    })

    let midData = [
        suitOneDataA[0], suitOneDataB[1], suitOneDataC[2], suitOneDataD[3], suitOneDataE[4], suitOneDataF[5]
    ];

    let newObj = {};
    midData.forEach((v, i) =>{
        newObj = { ...newObj, ...v };
    })

    let newData = [newObj];
    
    // console.log(newData);
    res.json(newData);
});

// 首頁卡片用的文章資料 // get
// http://localhost:3002/api/home//card-info-home
router.get("/card-info-home", async (req, res, next) => {
    let [data] = await connection.execute(
        "SELECT info_no, info_cat_id, big_title, author, big_img, create_time, one_text_one, info_cat FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id ORDER BY information.create_time DESC LIMIT ?", [4]
    );

    // console.log(data);
    res.json(data);
});

module.exports = router;