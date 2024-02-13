const { createApp, ref, onMounted } = Vue;

const app = createApp({
  setup() {
    const posts = ref([]);
    const loading = ref(false);
    const pageNum = ref(1);
    const scrollContainer = ref(null);

    const checkScrollPosition = () => {
      const scrollTop = scrollContainer.value.scrollTop;
      const scrollHeight = scrollContainer.value.scrollHeight;
      const clientHeight = scrollContainer.value.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreItems();
      }
    };

    onMounted(() => {
      scrollContainer.value.addEventListener("scroll", checkScrollPosition);
      loadMoreItems();
    });

    const loadMoreItems = async () => {
      loading.value = true;
      const uri = `https://jsonplaceholder.typicode.com/posts?_page=${pageNum.value}`;
      const res = await fetch(uri);
      const newPosts = await res.json();
      posts.value.push(...newPosts);
      pageNum.value += 1;
      loading.value = false;
    };

    return {
      posts,
      loading,
      pageNum,
      loadMoreItems,
      checkScrollPosition,
      scrollContainer,
    };
  },
});

app.mount("#app");
