const { createApp, ref } = Vue;

const app = createApp({
  data() {
    return {
      food: "",
      meals: [],
      meal: null,
      selectedMeal: {
        ingredients: [],
      },
    };
  },
  methods: {
    async searchFood(random = false) {
      // this.selectedMeal = {};
      const url = random
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${this.food}`
        : "https://www.themealdb.com/api/json/v1/1/random.php";
      const res = await fetch(url);
      const json = await res.json();
      this.meals = json.meals;
    },

    async selectMeal(meal) {
      Object.keys(meal).forEach((key) => {
        if (key.startsWith("strIngredient") && meal[key] !== "") {
          this.selectedMeal.ingredients.push(meal[key]);
        } else if (meal[key] !== "") {
          this.selectedMeal[key] = meal[key];
        }
      });
      console.log(this.selectMeal);
      this.meal = meal;
    },
  },
});

app.mount("#app");
