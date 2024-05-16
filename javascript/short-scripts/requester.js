const request = require("request");

const restGetURL = (url, body) =>
  new Promise((resolve, reject) => {
    const cb = (error, res, body) => {
      if (error) return reject(error);

      return resolve(body);
    };

    console.log(body);

    request(
      {
        url,
        body: JSON.stringify({ start_date: "sa" }),
        headers: {
          "Content-Type": "application/json",
        },
      },
      cb
    );
  });

const getTreasuryRate = async () => {
  try {
    const response = await restGetURL(
      "https://ycharts.com/charts/fund_data.json?&securities=id%3AI%3A10YTCMR%2Cinclude%3Atrue%2C%2C&",
      { start_date: "2023-01-01" }
    );

    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

getTreasuryRate();
