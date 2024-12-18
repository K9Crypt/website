<script>
    import "../app.css";
    import Snow from "../components/Snow.svelte";
</script>

<slot></slot>

<Snow/>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

    :global(body) {
        font-family: 'Poppins', sans-serif;
        background-color: #121212;
        color: #fff;
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

    :global(pre) {
        background: #1E1E1E;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
        overflow-x: auto;
    }

    :global(code.inline-code) {
        background: #2C2C2C;
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-family: monospace;
    }

    :global(ul, ol) {
        padding-left: 1.5rem;
        margin: 0.5rem 0;
    }

    :global(ul) {
        list-style-type: disc;
    }

    :global(ol) {
        list-style-type: decimal;
    }

    :global(blockquote) {
        border-left: 3px solid #B9F21B;
        padding-left: 1rem;
        margin: 0.5rem 0;
        color: rgba(255, 255, 255, 0.7);
    }

    :global(h1, h2, h3, h4, h5, h6) {
        font-weight: 600;
        margin: 0.5rem 0;
    }

    :global(a) {
        color: #B9F21B;
        text-decoration: underline;
    }
</style>