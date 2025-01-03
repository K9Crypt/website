<script>
    const shieldFeatures = [
        {
            title: "DDoS Protection",
            description: "Progressive penalty system, connection tracking, burst detection and path-based rate limiting with configurable thresholds",
            icon: "ri-shield-flash-line"
        },
        {
            title: "Rate Limiting",
            description: "Route-specific limits, flexible time windows, throttling support and distributed system compatibility",
            icon: "ri-dashboard-3-line"
        },
        {
            title: "IP Management",
            description: "CIDR notation, IPv6 support, private IP detection, whitelist/blacklist functionality and proxy support",
            icon: "ri-global-line"
        },
        {
            title: "Request Validation",
            description: "Method validation, payload limits, header validation and pattern detection for SQL Injection, XSS, Path Traversal",
            icon: "ri-scan-line"
        },
        {
            title: "Security Headers",
            description: "Content Security Policy (CSP), Permissions Policy, HSTS support, XSS protection and frame options",
            icon: "ri-lock-line"
        },
        {
            title: "Pattern Detection",
            description: "SQL Injection patterns, XSS patterns, path traversal attempts and custom pattern support",
            icon: "ri-radar-line"
        },
        {
            title: "Monitoring & Logging",
            description: "Multiple log levels, automatic rotation, archive management and security event tracking",
            icon: "ri-file-chart-line"
        },
        {
            title: "Request Tracking",
            description: "IP tracking, request duration, path monitoring and detailed request information",
            icon: "ri-route-line"
        }
    ];
</script>

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">Comprehensive Security Features</h2>
            <p class="text-white/50 text-sm sm:text-base">Advanced security middleware providing robust protection for Node.js applications</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each shieldFeatures as feature}
            <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="absolute top-1 right-1 font-bold opacity-5 text-4xl select-none transition-all duration-300 group-hover:opacity-15">
                    <i class="{feature.icon}"></i>
                </div>
                <div class="relative z-10">
                    <h4 class="text-lg font-semibold mb-2">{feature.title}</h4>
                    <p class="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
            </div>
            {/each}
        </div>
    </div>
</section>