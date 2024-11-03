<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    let isLoaded = false;

    const teamMembers = [
        {
            name: "Fatih Yılmaz",
            role: "Founder & CEO",
            description: "Fatih Yilmaz, founder and CEO of K9Crypt, is a technology leader who develops innovative web solutions with the user experience at the forefront.",
            socials: {
                github: "https://github.com/queaxtra",
                twitter: "https://x.com/queaxtra",
                linkedin: "https://linkedin.com/in/queaxtra",
                mail: "mailto:queaxtra@k9crypt.xyz",
            }
        },
        {
            name: "Emin Bıyıkçı",
            role: "CEO & Front-end Developer",
            description: "Emin, experienced front-end developer with a passion for creating visually appealing and user-friendly interfaces.",
            socials: {
                github: "https://github.com/eminexedev",
                mail: "mailto:emin@k9crypt.xyz",
            }
        }
    ];

    const companyInfo = {
        mission: "To provide the most secure and private messaging platform while maintaining simplicity and accessibility for everyone.",
        vision: "Creating a world where private communication is a fundamental right, not a luxury.",
        values: [
            "Privacy First",
            "Security by Design",
            "User Empowerment",
            "Transparency"
        ],
        story: "Founded in June 2024, K9Crypt grew out of a simple idea: communication should be private by default. Our team of developers came together to build a platform that makes secure messaging accessible to everyone."
    };

    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });
</script>

<Navbar />
<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        {#if !isLoaded}
        <div class="space-y-8 animate-pulse">
            <div class="space-y-3">
                <div class="h-8 bg-cWhiteGray rounded w-64"></div>
                <div class="h-4 bg-cWhiteGray rounded w-96"></div>
            </div>
            
            <div class="h-48 bg-cWhiteGray border border-white/5 rounded"></div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each Array(2) as _}
                <div class="bg-cWhiteGray border border-white/5 rounded p-6 h-40"></div>
                {/each}
            </div>

            <div class="space-y-4">
                <div class="h-8 bg-cWhiteGray rounded w-48"></div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {#each Array(4) as _}
                    <div class="h-12 bg-cWhiteGray border border-white/5 rounded"></div>
                    {/each}
                </div>
            </div>

            <div class="space-y-4">
                <div class="h-8 bg-cWhiteGray rounded w-48"></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {#each Array(2) as _}
                    <div class="bg-cWhiteGray border border-white/5 rounded p-6 h-64"></div>
                    {/each}
                </div>
            </div>

            <div class="bg-cWhiteGray border border-white/5 rounded p-6">
                <div class="space-y-4">
                    <div class="h-6 bg-cWhiteGray rounded w-48"></div>
                    <div class="h-4 bg-cWhiteGray rounded w-72"></div>
                    <div class="flex gap-4">
                        <div class="h-4 bg-cWhiteGray rounded w-32"></div>
                        <div class="h-4 bg-cWhiteGray rounded w-32"></div>
                    </div>
                </div>
            </div>
        </div>
        {:else}
        <div class="mb-8 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">About K9Crypt</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">Dedicated to making secure communication accessible to everyone.</p>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded p-6 mb-12 hover:bg-cWhiteGray transition-all duration-300">
            <h2 class="text-xl font-semibold mb-4">Our Story</h2>
            <p class="text-white/50 text-sm leading-relaxed">{companyInfo.story}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div class="bg-cWhiteGray border border-white/5 rounded p-6 hover:bg-cWhiteGray transition-all duration-300">
                <div class="relative z-10">
                    <h2 class="text-xl font-semibold mb-3">Our Mission</h2>
                    <p class="text-white/50 text-sm">{companyInfo.mission}</p>
                </div>
            </div>
            <div class="bg-cWhiteGray border border-white/5 rounded p-6 hover:bg-cWhiteGray transition-all duration-300">
                <div class="relative z-10">
                    <h2 class="text-xl font-semibold mb-3">Our Vision</h2>
                    <p class="text-white/50 text-sm">{companyInfo.vision}</p>
                </div>
            </div>
        </div>

        <div class="mb-12">
            <h2 class="text-2xl font-semibold mb-6">Our Values</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {#each companyInfo.values as value}
                <div class="bg-cWhiteGray border border-white/5 rounded p-4 text-center hover:bg-cWhiteGray transition-all duration-300">
                    <span class="text-white/80 font-medium">{value}</span>
                </div>
                {/each}
            </div>
        </div>

        <div class="mb-12">
            <h2 class="text-2xl font-semibold mb-6">Our Team</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each teamMembers as member}
                <div class="bg-cWhiteGray border border-white/5 rounded p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                    <div class="relative z-10">
                        <h3 class="text-xl font-semibold mb-1">{member.name}</h3>
                        <p class="text-white/70 text-sm mb-3">{member.role}</p>
                        <p class="text-white/50 text-sm mb-4">{member.description}</p>
                        <div class="flex gap-4">
                        {#if member.socials.github}
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <a href={member.socials.github} class="text-white/50 hover:text-white transition-colors duration-300">
                            <i class="ri-github-fill text-xl"></i>
                            </a>
                        {/if}
                            
                        {#if member.socials.twitter}
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <a href={member.socials.twitter} class="text-white/50 hover:text-white transition-colors duration-300">
                            <i class="ri-twitter-x-fill text-xl"></i>
                        </a>
                        {/if}
                            
                        {#if member.socials.linkedin}
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <a href={member.socials.linkedin} class="text-white/50 hover:text-white transition-colors duration-300">
                            <i class="ri-linkedin-fill text-xl"></i>
                        </a>
                        {/if}

                        {#if member.socials.mail}
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <a href={member.socials.mail} class="text-white/50 hover:text-white transition-colors duration-300">
                            <i class="ri-mail-fill text-xl"></i>
                            </a>
                        {/if}
                        </div>
                    </div>
                </div>
                {/each}
            </div>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded p-6 hover:bg-cWhiteGray transition-all duration-300">
            <h3 class="text-lg font-semibold mb-4">Get in Touch</h3>
            <p class="text-white/50 text-sm mb-4">Want to learn more about K9Crypt or join our team?</p>
            <div class="flex gap-4">
                <a href="mailto:hi@k9crypt.xyz" class="flex items-center text-sm text-white/50 hover:text-white transition-colors duration-300">
                    <i class="ri-mail-fill mr-2"></i>
                    hi@k9crypt.xyz
                </a>
                <a href="https://github.com/k9crypt" class="flex items-center text-sm text-white/50 hover:text-white transition-colors duration-300">
                    <i class="ri-github-fill mr-2"></i>
                    GitHub
                </a>
            </div>
        </div>
        {/if}
    </div>
</section>

<Footer />