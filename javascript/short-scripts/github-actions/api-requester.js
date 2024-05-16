const util = require("util");
const request = util.promisify(require("request"));

async function makeRequest() {
  return request({
    uri: `http://localhost:5000/prevIncomeTypes`,
    method: "PUT",
    json: true,
  });
}

async function main() {
  const res = await makeRequest();
  console.log(res.body);
}

main();
