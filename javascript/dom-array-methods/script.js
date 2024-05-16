const addUser = document.getElementById("add-user");
const doubleMoney = document.getElementById("double");
const showMillionaires = document.getElementById("show-millionaires");
const sort = document.getElementById("sort");
const calculateWealth = document.getElementById("calculate-wealth");
const main = document.getElementById("main");

let totalPeople = [];

addNewPerson();
addNewPerson();
addNewPerson();

addUser.addEventListener("click", addNewPerson);
doubleMoney.addEventListener("click", doubleMoneyF);
showMillionaires.addEventListener("click", showMillionairesF);
sort.addEventListener("click", sortF);
calculateWealth.addEventListener("click", calculateWealthF);

async function fetchNewUser() {
  const res = await fetch("https://randomuser.me/api");
  const person = res.ok ? await res.json() : null;
  return person ? person.results[0] : null;
}

async function addNewPerson(e = null) {
  const person = await fetchNewUser();
  if (person) {
    const name = `${person.name.first} ${person.name.last}`;
    const wealth = Math.round((50000 + Math.random() * 2000000) * 100) / 100;
    totalPeople.push({ name, wealth });
    renderPeople();
  } else {
    alert("Could not add new Person");
  }
}

function renderPeople(people = totalPeople) {
  main.innerHTML = "<h2><strong>Person</strong> Wealth</h2>";
  people.forEach((person) => {
    const { name, wealth } = person;
    const child = document.createElement("div");
    child.innerHTML = `<h3><strong>${name}</strong>${wealth}</h3>`;
    main.appendChild(child);
  });
}

function doubleMoneyF() {
  const doubleMoney = totalPeople.map(({ name, wealth }) => ({
    name,
    wealth: (wealth *= 2),
  }));
  totalPeople = doubleMoney;
  renderPeople(doubleMoney);
}

function showMillionairesF() {
  const millionaires = totalPeople.filter(({ wealth }) => wealth > 1000000);
  console.log({ millionaires });
  renderPeople(millionaires);
}

function sortF() {
  const sortedByWealth = totalPeople.sort(
    ({ wealth: wealth1 }, { wealth: wealth2 }) => wealth2 - wealth1
  );
  renderPeople(sortedByWealth);
}

function calculateWealthF() {
  const wealth = totalPeople.reduce((acc, user) => (acc += user.money), 0);

  const wealthEl = document.createElement("div");
  wealthEl.innerHTML = `<h3>Total Wealth: <strong>${formatMoney(
    wealth
  )}</strong></h3>`;
  main.appendChild(wealthEl);
}
