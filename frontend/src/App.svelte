<script>
  import { Router, Route } from 'svelte-routing';
  import Search from './Search.svelte';
  import WordDetail from './WordDetail.svelte';
</script>

<main>
  <h1>Hanzi Memorizer</h1>
  <Router>
    <Route path="/" component={Search} />
    <Route path="/search" component={Search} />
    <Route path="/hanzi/:id" let:params>
      <WordDetail {params} />
    </Route>
  </Router>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
  }
</style>