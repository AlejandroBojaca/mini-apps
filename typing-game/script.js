const { createApp, ref, onMounted, watch } = Vue;

const app = createApp({
  setup() {
    const seconds = ref(30);
    const score = ref(0);
    const input = ref("");
    const difficulty = ref("easy");
    const words = [
      "head",
      "back",
      "tail",
      "mammoth",
      "giraffe",
      "pikachu",
      "ash",
      "dark",
      "soul",
      "shogun",
      "meantime",
    ];
    const word = ref("head");
    const displayScore = ref(false);
    let interval = null;

    const getNewWord = () => {
      const newWord = words[Math.floor(Math.random() * words.length)];
      if (newWord === word.value) {
        getNewWord();
        return;
      }
      word.value = newWord;
    };

    const increaseTime = () => {
      const diff = difficulty.value;
      const adition = diff === "easy" ? 5 : diff === "medium" ? 3 : 2;
      seconds.value += adition;
    };
    const increaseScore = () => (score.value += 1);
    const resetInput = () => (input.value = "");

    onMounted(() => {
      getNewWord();
      interval = setInterval(() => (seconds.value -= 1), 1000);
    });

    watch(seconds, (value) => {
      if (value === 0) {
        clearInterval(interval);
        displayScore.value = true;
      }
    });

    watch(input, (value) => {
      console.log(value, word.value, value === word.value);
      if (value === word.value) {
        getNewWord();
        increaseTime();
        increaseScore();
        resetInput();
        console.log(seconds.value);
      }
    });

    return {
      seconds,
      score,
      displayScore,
      word,
      input,
      getNewWord,
      difficulty,
    };
  },
});

app.mount("#app");
