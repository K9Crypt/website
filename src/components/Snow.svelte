<script lang="ts">
    import { onMount } from "svelte";
    const totalSnowflakes = 30;

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 5 + 5 + 's';
        snowflake.style.opacity = Math.random().toString();
        snowflake.style.width = snowflake.style.height = Math.random() * 4 + 2 + 'px';
        return snowflake;
    }

    function removeSnowflake(snowflake: HTMLDivElement) {
        snowflake.remove();
    }

    function startSnowing() {
        const snowflake = createSnowflake();
        document.body.appendChild(snowflake);

        snowflake.addEventListener('animationend', () => {
            removeSnowflake(snowflake);
        });
    }

    let interval: number;
    
    onMount(() => {
        interval = setInterval(startSnowing, 300);
        return () => {
            clearInterval(interval);
            document.querySelectorAll('.snowflake').forEach(s => s.remove());
        };
    });
</script>

<style>
    :global(.snowflake) {
        position: fixed;
        top: -10px;
        border-radius: 100%;
        background-color: white;
        pointer-events: none;
        animation: fall linear forwards;
        will-change: transform;
    }

    @keyframes fall {
        to {
            transform: translateY(100vh);
        }
    }
</style>