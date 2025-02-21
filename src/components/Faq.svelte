<script lang="ts">
    import { slide } from 'svelte/transition';
    import { _ } from 'svelte-i18n';

    let faqItems = [
        {
            question: $_('faq.questions.isFree.question'),
            answer: $_('faq.questions.isFree.answer'),
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: $_('faq.questions.account.question'),
            answer: $_('faq.questions.account.answer'),
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: $_('faq.questions.openSource.question'),
            answer: $_('faq.questions.openSource.answer'),
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: $_('faq.questions.connection.question'),
            answer: $_('faq.questions.connection.answer'),
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: $_('faq.questions.messageLimit.question'),
            answer: $_('faq.questions.messageLimit.answer'),
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
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">{$_('faq.title')}</h2>
            <p class="text-white/50 text-sm sm:text-base">{$_('faq.subtitle')}</p>
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
