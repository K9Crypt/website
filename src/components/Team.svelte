<script>
  const teamMembers = [
    { username: "queaxtra", name: "Fatih Yılmaz", role: "CEO, Front-end Developer", social: { twitter: "https://twitter.com/queaxtra", github: "https://github.com/queaxtra", mail: "queaxtra@k9crypt.xyz" } },
    { username: "eminexedev", name: "Emin Bıyıkçı", role: "CEO", social: { github: "https://github.com/eminexedev", mail: "emin@k9crypt.xyz" } },
    { username: "dracho", name: "Patrick H.", role: "Full Stack Developer", social: { github: "https://github.com/dracho", mail: "dracho@k9crypt.xyz" } },
  ];
</script>

<div class="py-16 relative">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-6">Meet Our Team</h2>
    <p class="text-base text-center mb-6">We're a team of passionate developers who are dedicated to providing secure and reliable messaging solutions.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
      {#each teamMembers as member}
        <div class="p-4 rounded-lg border-2 border-dark-green hover:shadow-lg transition-shadow duration-300 relative">
          <h3 class="text-lg font-bold">{member.name}</h3>
          <p class="text-sm mb-2">@{member.username}</p>
          <p class="text-sm mb-2">{member.role}</p>
          <div class="flex space-x-3">
            {#if member.social.mail}
              <a href="mailto:{member.social.mail}"><i class="ri-mail-line"></i></a>
            {:else}
              <span class="w-6"></span>
            {/if}
            {#if member.social.github}
              <a href="{member.social.github}" target="_blank"><i class="ri-github-fill"></i></a>
            {:else}
              <span class="w-6"></span>
            {/if}
            {#if member.social.twitter}
              <a href="{member.social.twitter}" target="_blank"><i class="ri-twitter-fill"></i></a>
            {:else}
              <span class="w-6"></span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>