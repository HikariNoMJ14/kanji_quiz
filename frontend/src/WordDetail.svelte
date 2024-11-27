<script>
  import { onMount } from 'svelte';
  import { BACKEND_URL } from './config';

  export let params; // Ensure params is exported to receive the prop
  let wordId = params.id;
  let wordDetail = {};

  onMount(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/hanzi/${wordId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      wordDetail = await response.json();
    } catch (error) {
      console.error('Error fetching word details:', error);
    }
  });
</script>

<style>
  .word {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .word-detail-container {
    display: table;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    border-collapse: collapse;
  }

  .word-detail-row {
    display: table-row;
  }

  .word-detail-header, .word-detail-value {
    display: table-cell;
    padding: 10px;
    border: 1px solid #ddd;
  }

  .word-detail-header {
    font-weight: bold;
    background-color: #f9f9f9;
  }
</style>

<div class="word">{wordDetail.hanzi}</div>
<div class="word-detail-container">
  <div class="word-detail-row">
    <div class="word-detail-header">Pinyin</div>
    <div class="word-detail-value">{#if wordDetail.pinyins && wordDetail.pinyins.length > 0}{wordDetail.pinyins[0].pinyin1}{/if}</div>
  </div>
  <div class="word-detail-row">
    <div class="word-detail-header">Zhuyin</div>
    <div class="word-detail-value">{wordDetail.zhuyin}</div>
  </div>
  <div class="word-detail-row">
    <div class="word-detail-header">Translations</div>
    <div class="word-detail-value">
      {#each wordDetail.translations as translation}
        <p>{translation.translation}</p>
      {/each}
    </div>
  </div>
  <!-- Add more fields as needed -->
</div>