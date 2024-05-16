const fs = require("fs");
const moment = require("moment");

const filePath = "data.json";

const schema = {
  // example
  date: {
    $date: "2023-11-19T00:00:00.000Z",
  },
  presetId: "7a978757-46e0-40f4-b4e5-22175932422e",
  __v: 0,
  email: "alejandrobojaca1@gmail.com",
  endDate: null,
  portfolioId: "1a3ac4be-66e9-40fb-8414-78634001e082",
  processed: false,
  startDate: {
    $date: "2023-10-03T17:33:15.201Z",
  },
  userId: "53dd2d1c-0194-4c23-bba5-2247127b5423",
  valid: true,
  weights: [
    {
      strategyId: "ad699433-3253-4c8f-9c87-dffdc3fb5514",
      weight: 0.5,
    },
    {
      strategyId: "3045acd2-5e4d-4473-808e-dda35d55af2c",
      weight: 0.5,
    },
  ],
};

const startDate = moment.utc("2022-01-01");
const array = new Array(1000).fill().map((el, i) => {
  const date = moment(startDate).add(i, "day");
  const obj = Object.assign({}, schema);
  obj.date = { $date: date.format() };
  return obj;
});

const jsonData = JSON.stringify(array);

fs.writeFile(filePath, jsonData, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Successfully created file");
  }
});
