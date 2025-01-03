<script>
    const messageSteps = [
        {
            title: "Write Your Message",
            description: "Enter the message you want to send securely.",
            icon: "ri-message-2-fill",
            step: 1
        },
        {
            title: "Get Random Password",
            description: "System generates a random password for your message.",
            icon: "ri-lock-password-fill",
            step: 2
        },
        {
            title: "Share the Link",
            description: "Share the generated secure link with the recipient.",
            icon: "ri-share-fill",
            step: 3
        },
        {
            title: "Recipient Access",
            description: "Recipient uses the link and password to access the message.",
            icon: "ri-lock-unlock-fill",
            step: 4
        }
    ];

    const roomSteps = [
        {
            title: "Create a Room",
            description: "Set up a secure room for your conversations.",
            icon: "ri-home-fill",
            step: 1
        },
        {
            title: "Invite Members",
            description: "Invite members to join your room with a unique link.",
            icon: "ri-user-add-fill",
            step: 2
        },
        {
            title: "Start Chatting",
            description: "Begin secure conversations within your room.",
            icon: "ri-chat-3-fill",
            step: 3
        },
        {
            title: "Auto-Delete",
            description: "Messages in the room are automatically deleted after a set time.",
            icon: "ri-timer-flash-fill",
            step: 4
        }
    ];
</script>

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">How It Works</h2>
            <p class="text-white/50 text-sm sm:text-base">Learn how to securely send messages and create rooms with K9Crypt.</p>
        </div>

        <div class="mb-12">
            <h3 class="mb-3 flex items-center gap-2 text-white/50">
                <i class="ri-corner-up-right-fill"></i>Messages
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {#each messageSteps as step}
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

        <div class="mb-12">
            <h3 class="mb-3 flex items-center gap-2 text-white/50">
                <i class="ri-corner-up-right-fill"></i>Rooms
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {#each roomSteps as step}
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
    </div>
</section>
