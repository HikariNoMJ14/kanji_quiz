<script>
  import { onMount } from 'svelte';
  let query = '';
  let results = [];

  async function search() {
    const response = await fetch(`/api/search?query=${query}`);
    results = await response.json();
  }
</script>

<style>
  .search-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  .search-input {
    width: 100%;
    max-width: 400px;
    padding: 10px;
    margin-bottom: 20px;
  }
  .result-item {
    margin: 10px 0;
  }
</style>

<div class="search-container">
  <input
    class="search-input"
    type="text"
    placeholder="Enter zhuyin or pinyin"
    bind:value={query}
    on:input={search}
  />
  <div>
    {#each results as result}
      <div class="result-item">
        <strong>{result.hanzi}</strong> - {result.pinyin} - {result.zhuyin}
      </div>
    {/each}
  </div>
</div>