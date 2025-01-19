<script lang="ts">
    import { slide } from 'svelte/transition';

    let faqItems = [
        {
            question: "Is K9Vault completely free?",
            answer: "Yes, K9Vault is completely free and available for users to use.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "Is K9Vault open source?",
            answer: "Yes, K9Vault is open source. The source code is available on Github.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "Where does K9Vault store data?",
            answer: "K9Vault stores data on the user's computer. User data is only stored on the user's computer and does not communicate with any server.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "Is K9Vault end-to-end encrypted?",
            answer: "Yes, K9Vault is end-to-end encrypted.",
            icon: "ri-question-mark",
            isOpen: false
        }
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
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">Frequently Asked Questions</h2>
            <p class="text-white/50 text-sm sm:text-base">Detailed information about K9Vault's features and implementation.</p>
        </div>
        
        <div class="mx-auto flex flex-col gap-4">
            {#each faqItems as item, index}
            <div class="w-full bg-cWhiteGray border border-white/5 rounded-lg overflow-hidden hover:bg-cWhiteGray transition-all duration-300">
                <button class="w-full p-6 flex items-center justify-between text-left" on:click={() => toggleFaq(index)}>
                    <div class="flex items-center gap-4">
                        <i class="{item.icon} text-xl"></i>
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
    </div>
</section>