<script>
  import {onMount} from 'svelte';
  import {BACKEND_URL} from './config';

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
  .word-detail-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  .word {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .word-info {
    font-size: 18px;
  }
</style>

<div class="word-detail-container">
  <div class="word">{wordDetail.hanzi}</div>
  <div class="word-info">
    <p><strong>Pinyin:</strong> {wordDetail.pinyin}</p>
    <p><strong>Zhuyin:</strong> {wordDetail.zhuyin}</p>
    <!-- Add more fields as needed -->
  </div>
</div>