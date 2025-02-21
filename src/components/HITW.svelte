<script>
    import { _ } from 'svelte-i18n';

    const messageSteps = [
        {
            title: $_('hitw.sections.messages.steps.write.title'),
            description: $_('hitw.sections.messages.steps.write.description'),
            icon: "ri-message-2-fill",
            step: 1
        },
        {
            title: $_('hitw.sections.messages.steps.password.title'),
            description: $_('hitw.sections.messages.steps.password.description'),
            icon: "ri-lock-password-fill",
            step: 2
        },
        {
            title: $_('hitw.sections.messages.steps.share.title'),
            description: $_('hitw.sections.messages.steps.share.description'),
            icon: "ri-share-fill",
            step: 3
        },
        {
            title: $_('hitw.sections.messages.steps.access.title'),
            description: $_('hitw.sections.messages.steps.access.description'),
            icon: "ri-lock-unlock-fill",
            step: 4
        }
    ];

    const roomSteps = [
        {
            title: $_('hitw.sections.rooms.steps.create.title'),
            description: $_('hitw.sections.rooms.steps.create.description'),
            icon: "ri-home-fill",
            step: 1
        },
        {
            title: $_('hitw.sections.rooms.steps.invite.title'),
            description: $_('hitw.sections.rooms.steps.invite.description'),
            icon: "ri-user-add-fill",
            step: 2
        },
        {
            title: $_('hitw.sections.rooms.steps.chat.title'),
            description: $_('hitw.sections.rooms.steps.chat.description'),
            icon: "ri-chat-3-fill",
            step: 3
        },
        {
            title: $_('hitw.sections.rooms.steps.delete.title'),
            description: $_('hitw.sections.rooms.steps.delete.description'),
            icon: "ri-timer-flash-fill",
            step: 4
        }
    ];
</script>

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">{$_('hitw.title')}</h2>
            <p class="text-white/50 text-sm sm:text-base">{$_('hitw.subtitle')}</p>
        </div>

        <div class="mb-12">
            <h3 class="mb-3 flex items-center gap-2 text-white/50">
                <i class="ri-corner-up-right-fill"></i>{$_('hitw.sections.messages.title')}
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
                <i class="ri-corner-up-right-fill"></i>{$_('hitw.sections.rooms.title')}
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
