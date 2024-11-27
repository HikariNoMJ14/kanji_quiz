<script>
  import { Link } from 'svelte-routing';
</script>

<style>
  .navbar {
    display: flex;
    justify-content: space-around;
    background-color: #333;
    padding: 1em;
  }

  .nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5em 1em;
  }

  .nav-link:hover {
    background-color: #555;
  }
</style>

<div class="navbar">
  <Link to="/" class="nav-link">Search</Link>
</div>