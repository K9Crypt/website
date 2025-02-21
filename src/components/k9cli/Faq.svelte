<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { slide } from 'svelte/transition';
    
    let activeIndex = -1;

    const faqs = [
        {
            question: $_('k9cli.faq.installation.question'),
            answer: $_('k9cli.faq.installation.answer')
        },
        {
            question: $_('k9cli.faq.requirements.question'),
            answer: $_('k9cli.faq.requirements.answer')
        },
        {
            question: $_('k9cli.faq.commands.question'),
            answer: $_('k9cli.faq.commands.answer')
        },
        {
            question: $_('k9cli.faq.encryption.question'),
            answer: $_('k9cli.faq.encryption.answer')
        },
        {
            question: $_('k9cli.faq.updates.question'),
            answer: $_('k9cli.faq.updates.answer')
        }
    ];

    function toggleFaq(index: number) {
        if (activeIndex === index) {
            activeIndex = -1;
        } else {
            activeIndex = index;
        }
    }
</script>

<section class="py-16 px-4">
    <div class="container mx-auto max-w-3xl">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">{$_('k9cli.faq.title')}</h2>
            <p class="text-white/50">{$_('k9cli.faq.subtitle')}</p>
        </div>

        <div class="space-y-4">
            {#each faqs as faq, index}
                <div class="bg-cWhiteGray border border-white/5 rounded-lg overflow-hidden">
                    <button 
                        class="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all duration-300"
                        on:click={() => toggleFaq(index)}
                    >
                        <span class="text-left font-medium">{faq.question}</span>
                        <i class="ri-arrow-down-s-line text-xl transition-transform duration-300 {activeIndex === index ? 'rotate-180' : ''}"></i>
                    </button>
                    
                    {#if activeIndex === index}
                        <div 
                            class="px-6 py-4 text-white/70 text-sm border-t border-white/5"
                            transition:slide={{ duration: 300 }}
                        >
                            {faq.answer}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>