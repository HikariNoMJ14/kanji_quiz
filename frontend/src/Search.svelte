<script>
    import {onMount} from 'svelte';
    import {BACKEND_URL} from './config';

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
    />
    <label>
        <input type="checkbox" bind:checked={exactMatch}/>
        Exact match
    </label>
    <button class="search-button" on:click={search}>Search</button>
    <div>
        {#each results as result}
            <div class="result-item">
                <strong>{result.hanzi}</strong> - {result.pinyin} - {result.zhuyin}
            </div>
        {/each}
    </div>
</div>