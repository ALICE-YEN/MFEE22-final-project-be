const axios = require("axios");
const dayjs = require("dayjs");
require("dayjs/locale/zh-tw");
const mysql = require("mysql2");
require("dotenv").config();

(async () => {
  let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  try {
    // 根據日期變數去抓當前時間
    dayjs.locale("zh-tw");
    // dayjs().locale('zh-tw').format()
    let queryDate = dayjs(new Date()).format("YYYY-MM-DD");

    // 撈日落資料
    let response1 = await axios.get(
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001",
      {
        // 這裡放一些參數
        // params: 放 query string 的參數
        params: {
          Authorization: "CWB-13895ED9-375E-41C1-861A-1D79F5B481BD",
          format: "JSON",
          dataTime: queryDate,
        },
      }
    );
    // console.log(response1.data);

    let rawData1 = response1.data.records.locations.location;
    console.log(rawData1);
    // let dataRegional = [];
    // for (let i = 0; i < rawData1.length; i++) {
    //   dataRegional += rawData1[i].locationName;
    // }
    // console.log(dataRegional);

    // let dataSunset = dataRegional[0].time[0].parameter[5].parameterValue;
    // console.log(dataSunset);

    // let saveResult1 = await connection.execute(
    //   "UPDATE surfspot_sunset SET sunset_time= ? WHERE city=dataRegional",
    //   [dataRegional, dataSunset]
    // );
    // console.log(saveResult);
    // ====================================================================================

    // 撈紫外線資料
    // let response2 = await axios.get(
    //   "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0005-001",
    //   {
    //     // 這裡放一些參數
    //     // params: 放 query string 的參數
    //     params: {
    //       Authorization: "CWB-13895ED9-375E-41C1-861A-1D79F5B481BD",
    //       format: "JSON",
    //       locationCode:
    //         "466990,467660,467610,467660,467080,466920,466940,467590,467050,467490,467350,467410,467440",
    //       // dataTime: queryDate,
    //     },
    //   }
    // );
    // // console.log(response2.data);

    // let rawData2 = response2.data.records.weatherElement.location;
    // console.log(rawData2);
    // let saveResult2 = await connection.execute(
    //   "UPDATE surfspot_UV SET uv= ? WHERE location-code=?"
    // );
    // console.log(saveResult2);
    //=====================================================================================

    // 撈潮汐資料
    // let response3 = await axios.get(
    //   `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-A0021-001?Authorization=CWB-13895ED9-375E-41C1-861A-1D79F5B481BD&format=JSON&locationName=%E8%8A%B1%E8%93%AE%E7%B8%A3%E8%8A%B1%E8%93%AE%E5%B8%82,%E8%8A%B1%E8%93%AE%E7%B8%A3%E5%A3%BD%E8%B1%90%E9%84%89,%E8%8A%B1%E8%93%AE%E7%B8%A3%E8%B1%90%E6%BF%B1%E9%84%89,%E8%87%BA%E6%9D%B1%E7%B8%A3%E9%95%B7%E6%BF%B1%E9%84%89,%E8%87%BA%E6%9D%B1%E7%B8%A3%E6%88%90%E5%8A%9F%E9%8E%AE,%E8%87%BA%E6%9D%B1%E7%B8%A3%E6%9D%B1%E6%B2%B3%E9%84%89,%E8%87%BA%E6%9D%B1%E7%B8%A3%E8%87%BA%E6%9D%B1%E5%B8%82,%E5%AE%9C%E8%98%AD%E7%B8%A3%E9%A0%AD%E5%9F%8E%E9%8E%AE,%E5%AE%9C%E8%98%AD%E7%B8%A3%E8%98%87%E6%BE%B3%E9%8E%AE,%E6%96%B0%E5%8C%97%E5%B8%82%E6%B7%A1%E6%B0%B4%E5%8D%80,%E6%96%B0%E5%8C%97%E5%B8%82%E9%87%91%E5%B1%B1%E5%8D%80,%E6%96%B0%E5%8C%97%E5%B8%82%E7%9F%B3%E9%96%80%E5%8D%80,%E6%96%B0%E5%8C%97%E5%B8%82%E8%90%AC%E9%87%8C%E5%8D%80,%E6%96%B0%E5%8C%97%E5%B8%82%E8%B2%A2%E5%AF%AE%E5%8D%80,%E5%B1%8F%E6%9D%B1%E7%B8%A3%E6%BB%BF%E5%B7%9E%E9%84%89,%E5%B1%8F%E6%9D%B1%E7%B8%A3%E6%81%86%E6%98%A5%E9%8E%AE,%E5%B1%8F%E6%9D%B1%E7%B8%A3%E8%BB%8A%E5%9F%8E%E9%84%89,%E8%8B%97%E6%A0%97%E7%B8%A3%E7%AB%B9%E5%8D%97%E9%8E%AE,%E8%8B%97%E6%A0%97%E7%B8%A3%E5%BE%8C%E9%BE%8D%E9%8E%AE,%E8%87%BA%E4%B8%AD%E5%B8%82%E5%A4%A7%E7%94%B2%E5%8D%80,%E8%87%BA%E4%B8%AD%E5%B8%82%E5%A4%A7%E5%AE%89%E5%8D%80,%E6%BE%8E%E6%B9%96%E7%B8%A3%E9%A6%AC%E5%85%AC%E5%B8%82,%E8%87%BA%E5%8D%97%E5%B8%82%E5%AE%89%E5%B9%B3%E5%8D%80,%E9%AB%98%E9%9B%84%E5%B8%82%E6%97%97%E6%B4%A5%E5%8D%80&elementName=1%E6%97%A5%E6%BD%AE%E6%B1%90&sort=validTime&startTime=${queryDate}T00%3A00%3A00`
    // );
    // console.log(response3.data);

    // let rawData3 =
    //   response3.data.records.location[0].validTime[0].weatherElement[0].time;
    // console.log(rawData3);
    // ===============================================================================

    // 撈海象資料;
    // let response4 = await axios.get(
    //   `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=CWB-13895ED9-375E-41C1-861A-1D79F5B481BD&format=JSON&stationID=C4T01,46699A,C4S02,WRA007,46708A,C4U01,C4B03,C4B01,C4A02,46714D,C4Q02,C4D01,C6F01,C6W10,C4N01,C6V27&dataTime=${queryDate}T08%3A00%3A00`
    // );
    // console.log(response4.data);

    // let rawData4 =
    //   response4.data.records.seaSurfaceObs.location[1].stationObsTimes
    //     .stationObsTime[0].weatherElements;
    // console.log(rawData4);
  } catch (e) {
    console.error(e);
  }
  connection.end();
})();
