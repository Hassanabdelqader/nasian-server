/* eslint-disable */
"use strict";

const { default: axios } = require("axios");

let cashed = {};
let arr = [];
let count = 0;

function getData(req, res, next) {
  count++;
  console.log(cashed);
  if (count === 4) {
    count = 0;
    cashed = {};
  }

  if (cashed[req.query.q]) {
    res.status(200).json({ data: cashed[req.query.q] });
    return;
  }

  let obj = {
    title: "",
    href: "",
    description: "",
    photographer: "",
    date_created: "",
    center: "",
  };

  axios
    .get(`https://images-api.nasa.gov/search?q=${req.query.q}&media_type=video`)
    .then((data) => {
      arr = [];
      if (data.data.collection.metadata.total_hits === 0) {
        const error = new Error(
          "there is no Data try with other Search Query ..."
        );
        next(error);
      } else {
        let count = 0;
        let ID;
        for (
          let index = 0;
          index < data.data.collection.items.length;
          index++
        ) {
          ID = data.data.collection.items[index].data[0].nasa_id;
          let bool = /\s/.test(ID);
          if (!bool) {
            obj = {};
            obj.title = data.data.collection.items[index].data[0].title;
            obj.href = data.data.collection.items[index].href;
            obj.description =
              data.data.collection.items[index].data[0].description;
            obj.date_created =
              data.data.collection.items[index].data[0].date_created;
            obj.photographer =
              data.data.collection.items[index].data[0].photographer ||
              "Unavailable Photographer Name : ";
            obj.center = data.data.collection.items[index].data[0].center;
            arr.push(obj);
            count++;
            if (count === 100) break;
          }
        }
        next();
      }
    })
    .catch((err) => {
      const error = new Error(
        `there is an error with server it is self ... ${err}`
      );
      next(error);
    });
}
function getVideo(req, res, next) {
  let UpdatedArr = [];
  let tempUrl =
    "https://images-assets.nasa.gov/video/XRT20170910_Al_poly_noaxis/collection.json";
  let URL;

  for (let indexParent = 0; indexParent < arr.length; indexParent++) {
    URL = arr[indexParent].href || tempUrl;
    axios
      .get(URL)
      .then((data) => {
        for (let index = 0; index < data.data.length; index++) {
          if (
            data.data[index].endsWith("orig.mp4") ||
            data.data[index].endsWith("large.mp4") ||
            data.data[index].endsWith("medium.mp4") ||
            data.data[index].endsWith("small.mp4") ||
            data.data[index].endsWith("preview.mp4")
          ) {
            let obj = {
              ...arr[indexParent],
              url:
                data.data[index] ||
                "http://images-assets.nasa.gov/video/XRT20170910_Al_poly_noaxis/XRT20170910_Al_poly_noaxis~preview.mp4",
            };
            UpdatedArr.push(obj);
            break;
          }
        }
        if (indexParent === arr.length - 1) {
          cashed[req.query.q] = UpdatedArr;
          res.send({
            data: UpdatedArr,
          });
        }
      })
      .catch((err) => {
        const error = new Error(
          `there is an error with Href it is self ... ${err}`
        );
        next(error);
      });
  }
}

module.exports = {
  getData,
  getVideo,
};
