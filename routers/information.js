const express = require("express");
const { log } = require("npmlog");
const router = express.Router();
const connection = require("../utils/db");

// 文章首頁輪播用資料
// http://localhost:3002/api/information/caro
router.get("/caro", async (req, res, next) => {
    let [data] = await connection.execute(
        "SELECT info_no, info_cat_id, big_title, author, big_img, create_time, one_text_one, info_cat FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id ORDER BY information.create_time DESC LIMIT ?", [3]
    );

    // console.log(data);

    // 轉換data
    const infoOneDataA = data.map((v,i)=>{
        return {
            info_noA: v.info_no,
            info_cat_idA: v.info_cat_id,
            big_titleA: v.big_title,
            authorA: v.author,
            big_imgA: v.big_img,
            create_timeA: v.create_time,
            info_catA: v.info_cat,
        };
    })

    const infoOneDataB = data.map((v,i)=>{
        return {
            info_noB: v.info_no,
            info_cat_idB: v.info_cat_id,
            big_titleB: v.big_title,
            authorB: v.author,
            big_imgB: v.big_img,
            create_timeB: v.create_time,
            info_catB: v.info_cat,         
        };
    })

    const infoOneDataC = data.map((v,i)=>{
        return {
            info_noC: v.info_no,
            info_cat_idC: v.info_cat_id,
            big_titleC: v.big_title,
            authorC: v.author,
            big_imgC: v.big_img,
            create_timeC: v.create_time,
            info_catC: v.info_cat,               
        };
    })

    let midData = [
        infoOneDataA[0], infoOneDataB[1], infoOneDataC[2]
    ];

    let newObj = {};
    midData.forEach((v, i) =>{
        newObj = { ...newObj, ...v };
    })

    let newData = [newObj];


    // console.log(newData);
    res.json(newData);
});

// 加分頁
// 文章首頁的全部文章資料
// http://localhost:3002/api/information
router.get("/", async (req, res, next) => {

    // todo[1]
    let nowPage = req.query.page || 1;
    // console.log("取得目前URL query stirng提供的現在在第幾頁:", nowPage);

    // todo[2]
    let [midTotalInfo] = await connection.execute("SELECT COUNT(*) AS total FROM information");
    // console.log("midTotalInfo內容為:", midTotalInfo);
    let totalInfo = midTotalInfo[0].total;
    // console.log("totalInfo內容為:", totalInfo);

    // todo[3]
    const perPage = 6;
    let lastPage = Math.ceil(totalInfo / perPage);

    // todo[4]
    let offset = (nowPage - 1) * perPage;

    // todo[5]
    let [pageData] = await connection.execute("SELECT info_no, info_cat_id, big_title, author, big_img, create_time, one_text_one, info_cat FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id ORDER BY information.create_time DESC LIMIT ? OFFSET ?", 
    [ perPage, offset ]
    );

    // todo[6]
    res.json({
        pagination: {totalInfo, perPage, nowPage, lastPage},
        pageData
    });
});

// 加分頁
// 文章首頁的分類一資料
// http://localhost:3002/api/information/cat-one
router.get("/cat-one", async (req, res, next) => {

    // todo[1]
    let nowPage = req.query.page || 1;
    nowPage = parseInt(nowPage);
    // console.log("取得目前URL query stirng提供的現在在第幾頁:", nowPage);

    // todo[2]
    let [midTotalInfo] = await connection.execute("SELECT COUNT(*) AS total FROM information WHERE info_cat_id = ?", [1]);
    // console.log("midTotalInfo內容為:", midTotalInfo);
    totalInfo = midTotalInfo[0].total;
    // console.log("totalInfo內容為:", totalInfo);

    // todo[3]
    const perPage = 6; 
    let lastPage = Math.ceil(totalInfo / perPage); 
    
    // todo[4]
    let offset = (nowPage - 1) * perPage;
    
    // todo[5]
    let [pageData] = await connection.execute("SELECT info_no, info_cat_id, big_title, author, big_img, create_time, one_text_one, info_cat FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id WHERE information.info_cat_id = ? ORDER BY information.create_time DESC LIMIT ? OFFSET ?", 
    [ 1, perPage, offset ]
    );

    // todo[6]
    res.json({
        pagination: {totalInfo, perPage, nowPage, lastPage},
        pageData
    });
});

// 加分頁
// 文章首頁的分類二資料
// http://localhost:3002/api/information/cat-one
router.get("/cat-two", async (req, res, next) => {
    
    // todo[1]
    let nowPage = req.query.page || 1;
    nowPage = parseInt(nowPage);
    // console.log("取得目前URL query stirng提供的現在在第幾頁:", nowPage);

    // todo[2]
    let [midTotalInfo] = await connection.execute("SELECT COUNT(*) AS total FROM information WHERE info_cat_id = ?", [2])
    // console.log("midTotalInfo內容為:", midTotalInfo);
    let totalInfo = midTotalInfo[0].total;
    // console.log("totalInfo內容為:", totalInfo);

    // todo[3]
    const perPage = 6; 
    let lastPage = Math.ceil(totalInfo / perPage); 
    
    // todo[4]
    let offset = (nowPage - 1) * perPage;
    
    // todo[5]
    let [pageData] = await connection.execute("SELECT info_no, info_cat_id, big_title, author, big_img, create_time, one_text_one, info_cat FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id WHERE information.info_cat_id = ? ORDER BY information.create_time DESC LIMIT ? OFFSET ?", 
    [ 2, perPage, offset ]
    );

    // todo[6]
    res.json({
        pagination: {totalInfo, perPage, nowPage, lastPage},
        pageData
    });
});

// 加上、下一筆文章資料
// 文章詳細頁資料
// http://localhost:3002/api/information/:info_no
router.get("/:info_no", async (req, res, next) => {

    let [data] = await connection.execute(
    "SELECT * FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id WHERE info_no = ?",
    [req.params.info_no]
    );

    // 上、下一筆文章資料
    let nowInfoID = data[0].info_id;
    // console.log(nowInfoID);

    let nowInfoCatId = data[0].info_cat_id;
    // console.log(nowInfoCatId);

    let [nextData] = await connection.execute(
        "SELECT MIN(info_id) info_id, create_time, info_no, big_title, info_cat FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id WHERE info_cat_id = ? AND info_id > ?  ORDER BY information.info_id DESC LIMIT ?",
        [nowInfoCatId, nowInfoID, 1]
    );
    // console.log("下一筆資料:", nextData);

    let [prevData] = await connection.execute(
        "SELECT MAX(info_id) info_id, create_time, info_no, big_title, info_cat FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id WHERE info_cat_id = ? AND info_id < ?  ORDER BY information.info_id DESC LIMIT ?",
        [nowInfoCatId, nowInfoID, 1]
    );
    // console.log("上一筆資料:", prevData);

    res.json({
        prevData,
        nextData,
        data,
    });
});


// 加分頁
// 文章首頁 // 全部文章搜尋篩選
router.post("/all-search", async (req, res, next) => {
    // console.log("/all-search內容:", req.body.searchWord);
    // console.log("/all-search 分頁nowPage內容:", req.body.nowPage);

    // todo[1]
    let nowPage = req.body.nowPage || 1;
    nowPage = parseInt(nowPage);
    // console.log("取得目前URL query stirng提供的現在在第幾頁:", nowPage);

    // todo[2]
    let [midTotalInfo] = await connection.execute("SELECT COUNT(*) AS total FROM information WHERE big_title LIKE ? OR one_text_one LIKE ?", 
    [
        '%' + req.body.searchWord + '%',
        '%' + req.body.searchWord + '%',
    ]);
    // console.log("midTotalInfo內容為:", midTotalInfo);
    let totalInfo = midTotalInfo[0].total;
    // console.log("totalInfo內容為:", totalInfo);

    // todo[3]
    const perPage = 6; 
    let lastPage = Math.ceil(totalInfo / perPage); 
    
    // todo[4]
    let offset = (nowPage - 1) * perPage;
    
    // todo[5]
    let [pageData] = await connection.execute("SELECT info_no, info_cat_id, big_title, author, big_img, create_time, one_text_one, info_cat FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id WHERE big_title LIKE ? OR one_text_one LIKE ? ORDER BY create_time DESC LIMIT ? OFFSET ?",
    [
        '%' + req.body.searchWord + '%',
        '%' + req.body.searchWord + '%',
        perPage,
        offset,
    ]
    );

    // todo[6]
    res.json({
        pagination: {totalInfo, perPage, nowPage, lastPage},
        pageData
    });
    // console.log(pageData);   
});

// 加分頁
// 文章首頁 // 文章分類一搜尋篩選
router.post("/cat-one-search", async (req, res, next) => {
    // console.log("/cat-one-search內容:", req.body.catOneSearchWord);
    // console.log("/cat-one-search 分頁catOneSearchWord內容:", req.body.catOneNowPage);

    // todo[1]
    let nowPage = req.body.catOneNowPage || 1;
    nowPage = parseInt(nowPage);
    // console.log("取得目前URL query stirng提供的現在在第幾頁:", nowPage);

    // todo[2]
    let [midTotalInfo] = await connection.execute("SELECT COUNT(*) AS total FROM information WHERE info_cat_id = ? AND (big_title LIKE ? OR one_text_one LIKE ?)", 
    [
        1,
        '%' + req.body.catOneSearchWord + '%',
        '%' + req.body.catOneSearchWord + '%',
    ]);
    // console.log("midTotalInfo內容為:", midTotalInfo);
    let totalInfo = midTotalInfo[0].total;
    // console.log("totalInfo內容為:", totalInfo);

    // todo[3]
    const perPage = 6; 
    let lastPage = Math.ceil(totalInfo / perPage); 
    
    // todo[4]
    let offset = (nowPage - 1) * perPage;
    
    // todo[5]
    let [pageData] = await connection.execute("SELECT info_no, info_cat_id, big_title, author, big_img, create_time, one_text_one, info_cat FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id WHERE info_cat_id = ? AND (big_title LIKE ? OR one_text_one LIKE ?) ORDER BY create_time DESC LIMIT ? OFFSET ?",
    [
        1,
        '%' + req.body.catOneSearchWord + '%',
        '%' + req.body.catOneSearchWord + '%',
        perPage,
        offset,
    ]
    );

    // todo[6]
    res.json({
        pagination: {totalInfo, perPage, nowPage, lastPage},
        pageData
    });
    // console.log(pageData);
});

// 加分頁
// 文章首頁 // 文章分類二搜尋篩選
router.post("/cat-two-search", async (req, res, next) => {
    // console.log("/cat-two-search內容:", req.body.catTwoSearchWord);
    // console.log("/cat-two-search 分頁catTwoNowPage內容:", req.body.catTwoNowPage);

    // todo[1]
    let nowPage = req.body.catTwoNowPage || 1;
    nowPage = parseInt(nowPage);
    // console.log("取得目前URL query stirng提供的現在在第幾頁:", nowPage);

    // todo[2]
    let [midTotalInfo] = await connection.execute("SELECT COUNT(*) AS total FROM information WHERE info_cat_id = ? AND (big_title LIKE ? OR one_text_one LIKE ?)", 
    [
        2,
        '%' + req.body.catTwoSearchWord + '%',
        '%' + req.body.catTwoSearchWord + '%',
    ]);
    // console.log("midTotalInfo內容為:", midTotalInfo);
    let totalInfo = midTotalInfo[0].total;
    // console.log("totalInfo內容為:", totalInfo);

    // todo[3]
    const perPage = 6; 
    let lastPage = Math.ceil(totalInfo / perPage); 
    
    // todo[4]
    let offset = (nowPage - 1) * perPage;
    
    // todo[5]
    let [pageData] = await connection.execute("SELECT info_no, info_cat_id, big_title, author, big_img, create_time, one_text_one, info_cat FROM information LEFT JOIN info_cat_id ON information.info_cat_id = info_cat_id.id WHERE info_cat_id = ? AND (big_title LIKE ? OR one_text_one LIKE ?) ORDER BY create_time DESC LIMIT ? OFFSET ?",
    [
        2,
        '%' + req.body.catTwoSearchWord + '%',
        '%' + req.body.catTwoSearchWord + '%',
        perPage,
        offset,
    ]
    );

    // todo[6]
    res.json({
        pagination: {totalInfo, perPage, nowPage, lastPage},
        pageData
    });
    // console.log(pageData); 
});

module.exports = router;