const convertFrom = document.getElementById("convert-from");
const convertTo = document.getElementById("convert-to");
const swap = document.getElementById("swap");
const result = document.getElementById("result");
const quantity = document.getElementById("quantity");

const APIKEY = "21540682c58eeef5e4ddf316";

const getConvertionRate = async (fromCurrency, toCurrency) => {
  console.log(fromCurrency, typeof fromCurrency);
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${APIKEY}/latest/USD`,
    {
      method: "get",
    }
  );
  const data = res.ok ? await res.json() : null;
  console.log({ data });
  let conversionRate = null;
  if (data) {
    conversionRate = data.conversion_rates[toCurrency];
  }
  return conversionRate;
};

const calculateRate = async () => {
  const fromCurrency = convertFrom.value;
  const toCurrency = convertTo.value;
  const conversionRate = await getConvertionRate(fromCurrency, toCurrency);
  if (conversionRate) {
    result.innerText = String(Number((quantity.value || 0) * conversionRate));
  } else {
    alert("Could not fetch rate");
  }
};

swap.addEventListener("click", calculateRate);
