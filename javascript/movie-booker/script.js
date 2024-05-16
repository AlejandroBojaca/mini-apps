const freeSeats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movie = document.getElementById("movie");

setUI();

freeSeats.forEach((seat, index) => {
  seat.addEventListener("click", (e) => {
    console.log(index);
    updateSeat(index);
    updateTotal();
  });
});

movie.addEventListener("change", (e) => {
  updateTotal();
});

function updateSeat(index) {
  freeSeats[index].classList.toggle("selected");
  if (retrieveLocalStorage(index)) {
    deleteFromLocalStorage(index);
  } else {
    saveInLocalStorage(index, 1);
  }
}

function saveInLocalStorage(key, value) {
  localStorage.setItem(key, value);
  return true;
}

function deleteFromLocalStorage(key) {
  localStorage.removeItem(key);
}

function retrieveLocalStorage(key) {
  return localStorage.getItem(key);
}

function updateTotal() {
  const takenSeats = document.querySelectorAll(".seat.selected");

  total.textContent = takenSeats.length * Number(movie.value) || 0;
  count.textContent = takenSeats.length || 0;
}

function setUI() {
  freeSeats.forEach((seat, index) => {
    const seatInStorage = retrieveLocalStorage(index);
    if (seatInStorage) {
      seat.classList.toggle("selected");
    }
  });
  updateTotal();
}
