<script>
  import { Router, Route } from 'svelte-routing';
  import Search from './Search.svelte';
  import WordDetail from './WordDetail.svelte';
  import NavBar from './NavBar.svelte';
</script>

<Router>
  <NavBar />
  <main>
    <h1>Hanzi Memorizer</h1>
    <Route path="/" component={Search} />
    <Route path="/search" component={Search} />
    <Route path="/hanzi/:id" let:params>
      <WordDetail {params} />
    </Route>
  </main>
</Router>

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