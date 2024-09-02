<script lang="ts">
  import "../app.css";

  let theme = 'light';
  
  if (typeof window !== 'undefined') {
    theme = localStorage.getItem('theme') || 'light';
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

  :global(body) {
    font-family: "Plus Jakarta Sans", sans-serif;
    color: #090f00;
    background-color: #fbffe509;
    transition: background-color 0.3s ease;
  }

  :global(.dark body) {
    background-color: #131313;
    color: #fafafa;
  }
</style>

<slot></slot>