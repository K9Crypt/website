<script>
    const shieldSteps = [
        {
            title: "Installation",
            description: "Install K9Shield using npm: 'npm install k9shield' and import it into your Node.js application",
            icon: "ri-download-cloud-line",
            step: 1
        },
        {
            title: "Basic Configuration",
            description: "Configure core security settings including trustProxy, allowPrivateIPs, maxBodySize, and allowed methods",
            icon: "ri-settings-line",
            step: 2
        },
        {
            title: "Security Headers Setup",
            description: "Set up Content Security Policy, Permissions Policy, HSTS, and other security headers for enhanced protection",
            icon: "ri-shield-check-line",
            step: 3
        },
        {
            title: "Rate Limiting Configuration",
            description: "Configure route-specific rate limits, time windows, and throttling settings for different endpoints",
            icon: "ri-dashboard-3-line",
            step: 4
        },
        {
            title: "DDoS Protection Setup",
            description: "Set up connection tracking, burst detection, and path-based rate limiting with configurable thresholds",
            icon: "ri-shield-flash-line",
            step: 5
        },
        {
            title: "Pattern Detection",
            description: "Configure SQL injection, XSS, and path traversal pattern detection with custom pattern support",
            icon: "ri-radar-line",
            step: 6
        },
        {
            title: "Logging Configuration",
            description: "Set up logging levels, rotation settings, and monitoring for security events and request tracking",
            icon: "ri-file-chart-line",
            step: 7
        },
        {
            title: "Error Handling",
            description: "Configure custom error handlers and response formats for different security events",
            icon: "ri-error-warning-line",
            step: 8
        }
    ];
</script>

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">Implementation Steps</h2>
            <p class="text-white/50 text-sm sm:text-base">Complete guide to implementing K9Shield in your Node.js application</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each shieldSteps as step}
            <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="absolute -top-3 -right-3 font-bold opacity-5 text-8xl select-none transition-all duration-300 group-hover:opacity-15">
                    {step.step}
                </div>
                <div class="relative z-10">
                    <div class="mb-2">
                        <i class="{step.icon} text-2xl text-white/50"></i>
                    </div>
                    <h4 class="text-lg font-semibold mb-2">{step.title}</h4>
                    <p class="text-white/50 text-sm leading-relaxed">{step.description}</p>
                </div>
            </div>
            {/each}
        </div>
    </div>
</section>