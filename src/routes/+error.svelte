<script>
  import { goto } from "$app/navigation";
  import Navbar from "../components/Navbar.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<Navbar />
<section class="flex items-center justify-center h-screen">
  <div class="text-center max-w-lg">
    <h1 class="text-6xl font-bold  mb-4">404</h1>
    <p class="text-xl mb-4">Page Not Found</p>
    <p class=" mb-6">The page you're looking for doesn't exist or has been moved.</p>
    <button on:click={() => goto("/")} class="px-6 py-2 border-2 border-light-green bg-light-green dark:text-[#090f00] rounded-lg">
      Go Home
    </button>
  </div>
</section>
<Footer />