const seats = document.querySelectorAll(".seat");
const count = document.getElementById("count");
const total = document.getElementById("total");

const updateTotal = () => {
  const occupiedSeats = document.querySelectorAll(".occupied");
  const price = document.getElementById("movie");
  total.textContent = occupiedSeats.length * Number(price.value) || 0;
  count.textContent = occupiedSeats.length || 0;
};

seats.forEach((seat) => {
  seat.addEventListener("click", (e) => {
    const selectedSeat = e.target;
    selectedSeat.classList.toggle("occupied");
    updateTotal();
  });
});

const localStorage = () => {
  localStorage.setItem("myCat", "Tom");
};
