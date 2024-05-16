const axios = require("axios");
const fs = require("fs");
const { Parser } = require("json2csv");

let url = (portfolioId) =>
  `https://api.tradelink.pro/portfolio/get?portfolioId=${portfolioId}&extended=1&step=day&lang=en`;

async function getData(portfolio) {
  try {
    let response = await axios.get(url(portfolio));
    console.log(response.data, portfolio);
    if (response.data.data !== null) {
      console.log(portfolio);
    }
  } catch (error) {
    console.log("An error occurred while fetching the data:", error);
  }
}

const portfolios = [
  {
    _id: "2ffc76f8-c1bf-4c55-99fb-05d54cc77f75",
  },
  {
    _id: "e35b8510-ea28-4429-94e3-eeafb1d3a82d",
  },
  {
    _id: "67832ba3-c5f4-439d-9629-37c7382e6235",
  },
  {
    _id: "23258075-06cb-4012-97ca-5a012b25d650",
  },
  {
    _id: "330d49a3-18c2-4495-97c1-a85e0688cbf7",
  },
  {
    _id: "f28361b5-ddd9-4e2e-af2b-c34b6b886cf8",
  },
  {
    _id: "14ff654c-b219-4609-9997-cbe4cb35e4f5",
  },
  {
    _id: "ad537395-244f-4fec-b7a3-14c3fe8cf7fb",
  },
  {
    _id: "5b2f4e26-e175-4e46-b9ab-0abeb34b9bf9",
  },
  {
    _id: "5954f627-5178-4fa8-94b4-262b9498f737",
  },
  {
    _id: "7a7251d5-658f-4084-a344-4849a9183fd0",
  },
  {
    _id: "c6b99fbc-f26d-45fe-85c3-ff89640dc1c7",
  },
  {
    _id: "acefa45c-fc4b-4ef9-be59-bf7ddc4550bd",
  },
  {
    _id: "0d5edc29-45e3-497c-bda3-9a0cd92adb08",
  },
  {
    _id: "9a324212-3c7d-48f3-bd79-16a49d694aa6",
  },
  {
    _id: "59ac3908-3aa4-4fad-8b7e-096203b28fa5",
  },
  {
    _id: "707e8c7d-cf68-471c-b0ba-916057b1b5db",
  },
  {
    _id: "41765c90-e0df-4bf7-95e6-3089eb568c98",
  },
  {
    _id: "ade41f07-7c94-4e2b-9fa6-8bffde2614b8",
  },
  {
    _id: "61773903-e332-4462-8a19-0ddc2bb57a2f",
  },
  {
    _id: "e7921d20-94ad-49b9-83a7-ed6e8bde59d2",
  },
  {
    _id: "41eb6c19-08ca-4021-b246-8d11af5404a9",
  },
  {
    _id: "bf0f1401-090e-472d-8bb3-5ade297a1bd3",
  },
  {
    _id: "6e02498f-2313-48b3-b5b2-0be0c5c390fb",
  },
  {
    _id: "031747f8-1f0d-4ce6-a678-b7b989aa8673",
  },
  {
    _id: "f86a48b9-85f3-4de4-8847-b9c5de703285",
  },
  {
    _id: "10931cc1-0737-48ff-9e89-2e19bb4a9338",
  },
  {
    _id: "8ad5a519-a315-4e05-a14f-00fda12e7c62",
  },
  {
    _id: "c892baef-189e-4005-a055-39900ea8571f",
  },
  {
    _id: "a24ab5be-67c4-481c-a225-dfb4cff5b533",
  },
  {
    _id: "705a25db-e1ba-43e0-8d82-f1da154edcb2",
  },
  {
    _id: "1bb1553f-6934-4426-ba3b-19470fea23b0",
  },
  {
    _id: "a3dfe4a4-df05-4d9b-8956-a75fdb91b191",
  },
  {
    _id: "b0e86744-90bf-44b9-8912-6a88000ff72b",
  },
  {
    _id: "66c0cb8d-304d-4ece-a481-aea306428906",
  },
  {
    _id: "80d795ee-4df9-4d5b-942f-02fb43999d75",
  },
  {
    _id: "4a92b48d-de50-42cd-bb8e-05648c627c57",
  },
  {
    _id: "8b38129b-2397-4c5a-93ec-1010d688044b",
  },
  {
    _id: "133f625c-5015-45fe-af60-2c886f2f7273",
  },
  {
    _id: "8eb49121-2516-405b-b605-f2916c9f2ee6",
  },
  {
    _id: "70cf6405-67fe-4413-be9d-093f60ca8eaf",
  },
  {
    _id: "b49d5e70-9519-4447-ac12-88685c8cf504",
  },
  {
    _id: "c708b4cc-f10c-446f-8710-996e7e4e9c53",
  },
  {
    _id: "c4b58bb2-9fdd-4da2-b1d9-095f55089372",
  },
  {
    _id: "a70517b2-deaf-4f78-9e27-9d1473f9d41e",
  },
  {
    _id: "b9b2d3f9-030d-494a-ab4f-f8f8c9ef2ecf",
  },
  {
    _id: "5bd7d466-a14a-4df5-849a-1a33cb1c2447",
  },
  {
    _id: "c92fadb1-4f37-4dd0-a044-09daef33d478",
  },
  {
    _id: "30dfd2ca-4a16-4351-8ba5-f1df29956951",
  },
  {
    _id: "90b88607-8def-493f-b254-7bb68f78baf1",
  },
  {
    _id: "594a5a7d-b3bf-4955-8634-0ed792e32157",
  },
  {
    _id: "67b5943b-4dee-472d-9daf-a5d8638d5b27",
  },
  {
    _id: "216dc68e-c389-4228-877e-b0f9b0aba320",
  },
  {
    _id: "a98de06e-62e1-41b8-8b7e-754cc83315ad",
  },
];

[{ _id: "4a4f5ea0-7960-4cc4-a9cf-ae0ff1c32c65" }].forEach((portfolio) =>
  getData(portfolio._id)
);

let myCars = {
  car: {
    name: ["Audi"],
    price: ["40000"],
    color: ["blue"],
  },
};

let fields = ["car.name", "car.price", "car.color"];

const parser = new Parser({
  fields,
  unwind: ["car.name", "car.price", "car.color"],
});

const csv = parser.parse(myCars);

console.log("output", csv);
