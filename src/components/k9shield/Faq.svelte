<script lang="ts">
    import { slide } from 'svelte/transition';

    let faqItems = [
        {
            question: "What are the core security features of K9Shield?",
            answer: "K9Shield provides comprehensive security features including DDoS protection with progressive penalty system, rate limiting with route-specific limits, IP management with CIDR notation support, request validation, security headers management, pattern detection, and extensive monitoring & logging capabilities.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "How does the DDoS protection work?",
            answer: "K9Shield's DDoS protection includes progressive penalty system, connection tracking, burst detection, path-based rate limiting, and configurable thresholds. It monitors connection rates, automatically blocks suspicious IPs, and provides flexible configuration options for maximum connections and block durations.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "What kind of rate limiting options are available?",
            answer: "K9Shield offers route-specific limits, flexible time windows, throttling support, ban duration management, and distributed system support. You can configure different limits for various endpoints and HTTP methods with customizable thresholds.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "How does the IP management system work?",
            answer: "The IP management system supports CIDR notation, IPv6 with IPv4 mapping, private IP detection, whitelist/blacklist functionality, and proxy support. You can easily manage and monitor IP addresses through the provided API.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "What security headers are supported?",
            answer: "K9Shield supports Content Security Policy (CSP), Permissions Policy, HSTS, XSS protection, frame options, and content type options. These headers can be configured to enhance your application's security posture.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "How does the pattern detection system work?",
            answer: "The pattern detection system identifies SQL injection patterns, XSS patterns, path traversal attempts, and supports custom patterns. You can add your own detection patterns and configure the response actions.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "What monitoring and logging features are available?",
            answer: "K9Shield provides multiple log levels, automatic rotation, archive management, performance metrics, and security event tracking. The logging system includes IP tracking, request duration monitoring, path monitoring, and detailed request information.",
            icon: "ri-question-mark",
            isOpen: false
        },
        {
            question: "How do I configure K9Shield for my application?",
            answer: "K9Shield can be configured through a comprehensive configuration object that includes settings for security, rate limiting, DDoS protection, logging, and error handling. You can customize these settings based on your application's needs.",
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
            <p class="text-white/50 text-sm sm:text-base">Detailed information about K9Shield's features and implementation.</p>
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