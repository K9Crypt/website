<script lang="ts">
	import '../app.css';
	import Snow from '../components/Snow.svelte';
	let { children } = $props();
</script>

{@render children()}

<Snow />

<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    :global(body) {
        font-family: 'Poppins', sans-serif;
        background-color: #121212;
        color: #fff;
    }

    :global(html) {
        scroll-behavior: smooth;
    }

    :global(.highlight-message) {
        animation: highlight 2s ease-out;
        position: relative;
    }

    :global(.highlight-message::before) {
        content: '';
        position: absolute;
        inset: -2px;
        border: 2px solid #B9F21B;
        border-radius: 8px;
        animation: borderPulse 2s ease-out;
    }

    @keyframes highlight {
        0% { background-color: rgba(185, 242, 27, 0.15); }
        50% { background-color: rgba(185, 242, 27, 0.1); }
        100% { background-color: transparent; }
    }

    @keyframes borderPulse {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
</style>