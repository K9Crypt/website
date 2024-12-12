<script lang="ts">
    import { slide } from 'svelte/transition';
    import { onMount } from 'svelte';

    let isLoaded = false;

    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });

    let faqItems = [
        {
            question: "Is K9Crypt really free?",
            answer: "Yes, K9Crypt is completely free to use and doesn't require any payment or subscription.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "How secure is my data?", 
            answer: "All messages are protected with end-to-end encryption and automatically deleted after 2 hours.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "Do I need to create an account?",
            answer: "No, K9Crypt doesn't require any account creation or personal information.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "How long are messages stored?",
            answer: "Messages are automatically deleted after 2 hours for maximum security.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "Is K9Crypt open source?",
            answer: "Yes, K9Crypt is open source and available on GitHub.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "What happens if I lose my connection?",
            answer: "K9Crypt automatically attempts to reconnect when your connection is restored. Any unsent messages will be preserved until connection is re-established.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "Is there a message size limit?",
            answer: "No, chat without restrictions. Send unlimited messages in any room and communicate freely with others.",
            icon: "ri-question-mark",
            isOpen: false
        },
    ];

    function toggleFaq(index: number) {
        faqItems = faqItems.map((item, i) => ({
            ...item,
            isOpen: i === index ? !item.isOpen : false
        }));
    }
</script>

<section class="py-8 sm:py-12 md:py-16 px-4" id="faq">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        {#if !isLoaded}
        <div class="space-y-4 animate-pulse">
            <div class="space-y-3">
                <div class="h-8 bg-cWhiteGray rounded max-w-md"></div>
                <div class="h-4 bg-cWhiteGray rounded max-w-xl"></div>
            </div>
            
            <div class="flex flex-col gap-4 mt-8">
                {#each Array(4) as _}
                <div class="w-full h-16 bg-cWhiteGray border border-white/5 rounded"></div>
                {/each}
            </div>
        </div>
        {:else}
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md text-white/80">Frequently Asked Questions</h2>
            <p class="text-white/50 text-sm sm:text-base">Find answers to common questions about K9Crypt's services and features.</p>
        </div>
        
        <div class="mx-auto flex flex-col gap-4">
            {#each faqItems as item, index}
            <div class="w-full bg-cWhiteGray border border-white/5 rounded overflow-hidden hover:bg-cWhiteGray transition-all duration-300">
                <button class="w-full p-6 flex items-center justify-between text-left" on:click={() => toggleFaq(index)}>
                    <div class="flex items-center gap-4">
                        <i class="{item.icon} text-xl text-white/80"></i>
                        <h4 class="text-lg font-semibold">{item.question}</h4>
                    </div>
                    <i class="ri-arrow-down-s-fill text-xl transition-transform duration-300 {item.isOpen ? 'rotate-180' : ''}"></i>
                </button>
                
                {#if item.isOpen}
                <div class="px-6 pb-6 text-white/50 text-sm leading-relaxed" transition:slide={{ duration: 300 }}>
                    {item.answer}
                </div>
                {/if}
            </div>
            {/each}
        </div>
        {/if}
    </div>
</section>
