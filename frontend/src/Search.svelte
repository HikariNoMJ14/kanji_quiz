<script>
  import { onMount } from 'svelte';
  import { BACKEND_URL } from './config';
  import { navigate } from 'svelte-routing';

  let query = '';
  let exactMatch = false;
  let results = [];

  async function search() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/search?query=${query}&exact=${exactMatch}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      console.log('Response text:', responseText);
      if (contentType && contentType.indexOf('application/json') !== -1) {
        results = JSON.parse(responseText);
      } else {
        throw new Error('Response is not JSON');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      search();
    }
  }

  function openDetailPage(id) {
    navigate(`/hanzi/${id}`);
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

  .search-button {
    padding: 10px 20px;
    margin-bottom: 20px;
  }

  .results-container {
    width: 100%;
    max-width: 400px;
    text-align: left;
  }

  .result-item {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    cursor: pointer;
  }

  .result-word {
    width: 150px;
    font-weight: bold;
  }

  .result-zhuyin {
    width: 150px;
  }
</style>

<div class="search-container">
  <input
    class="search-input"
    type="text"
    placeholder="Enter zhuyin or pinyin"
    bind:value={query}
    on:keydown={handleKeydown}
  />
  <label>
    <input type="checkbox" bind:checked={exactMatch} />
    Exact match
  </label>
  <button class="search-button" on:click={search}>Search</button>
  <div class="results-container">
    {#each results as result (result.id)}
      <div class="result-item" on:click={() => openDetailPage(result.id)}>
        <div class="result-word">{result.hanzi}</div>
        <div class="result-zhuyin">{result.zhuyin}</div>
      </div>
    {/each}
  </div>
</div>