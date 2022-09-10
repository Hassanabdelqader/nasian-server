/* eslint-disable */
"use strict";

const { default: axios } = require("axios");

let cashed = {};
let arr = [];
let count = 0;

function getDataImages(req, res, next) {
  count++;
  console.log(count);
  if (count === 7) {
    count = 0;
    cashed[req.query.q] = null;
  }

  if (cashed[req.query.q]) {
    res.status(200).json({ data: cashed[req.query.q] });
    return;
  }

  let obj = {
    title: "",
    url: "",
    description: "",
    photographer: "",
    date_created: "",
    center: "",
  };

  axios
    .get(`https://images-api.nasa.gov/search?q=${req.query.q}&media_type=image`)
    .then((data) => {
      arr = [];
      if (data.data.collection.metadata.total_hits === 0) {
        const error = new Error(
          "there is no Data try with other Search Query With images ..."
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
         
            obj = {};
            obj.title = data.data.collection.items[index].data[0].title;
            obj.url = data.data.collection.items[index].links[0].href;
            obj.description =
              data.data.collection.items[index].data[0].description;
            obj.date_created =
              data.data.collection.items[index].data[0].date_created;
            obj.center = data.data.collection.items[index].data[0].center;
            arr.push(obj);
            count++;
            if (count === 100) break;
          
        }
        cashed[req.query.q] = arr
        res.send({
            data:arr
        })
      }
    })
    .catch((err) => {
      const error = new Error(
        `there is an error with server it is self With |image Api ... ${err}`
      );
      next(error);
    });
}


module.exports = {
    getDataImages
};
