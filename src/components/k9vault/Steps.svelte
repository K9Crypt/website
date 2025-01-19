<script>
    const shieldSteps = [
        {
            title: "Installation",
            description: "First, install the K9Vault application on your computer.",
            icon: "ri-download-cloud-line",
            step: 1
        },
        {
            title: "Photo Encryption",
            description: "Open the application and click the File Upload button and upload your photo.",
            icon: "ri-image-line",
            step: 2
        },
        {
            title: "Copy the Key",
            description: "After uploading your photo, copy the key provided in the console.",
            icon: "ri-key-line",
            step: 3
        },
        {
            title: "Photo Decryption (Optional)",
            description: "Make sure you have copied the key and go back to the K9Vault application and enter the key and upload your encrypted photo.",
            icon: "ri-lock-line",
            step: 4
        },
        {
            title: "That's It",
            description: "The K9Vault application is now installed on your computer and your photo is encrypted and stored securely.",
            icon: "ri-check-line",
            step: 5
        }
    ];
</script>

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">Implementation Steps</h2>
            <p class="text-white/50 text-sm sm:text-base">Complete guide to implementing K9Vault in your Node.js application</p>
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