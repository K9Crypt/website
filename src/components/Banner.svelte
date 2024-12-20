<script>
    import { onMount } from "svelte";
    let isLoaded = false;

    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });
</script>

{#if !isLoaded}
<div class="text-center py-12 px-6 space-y-4 animate-pulse">
    <div class="h-14 bg-cWhiteGray rounded max-w-lg mx-auto"></div>
    <div class="h-5 bg-cWhiteGray rounded max-w-2xl mx-auto"></div>
    <div class="flex flex-col sm:flex-row gap-4 justify-center mt-4">
        <div class="h-10 w-[160px] bg-cWhiteGray rounded mx-auto sm:mx-0"></div>
        <div class="h-10 w-[160px] bg-cWhiteGray rounded mx-auto sm:mx-0"></div>
    </div>
</div>
{:else}
<div class="text-center py-12 px-6 space-y-4">
    <h1 class="text-4xl font-bold mb-2">Your Messages, Only Yours!</h1>
    <p class="text-white/50 mb-4 font-light">Securely share your thoughts with the world, knowing that your messages are only accessible to you.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/start" class="flex items-center bg-cYellow text-black py-2 px-10 rounded font-medium justify-center">Get Started</a>
        <a href="/contact" class="flex items-center border bg-cYellow/10 border-cYellow text-cYellow py-2 px-10 rounded font-medium justify-center">Support</a>
    </div>
</div>
{/if}