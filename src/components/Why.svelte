<script>
  const items = [
    { icon: "ri-user-forbid-line", title: "No Account Needed", description: "K9Crypt does not require an account to use." },
    { icon: "ri-shield-keyhole-line", title: "E2E Encryption", description: "All messages are encrypted using end-to-end encryption." },
    { icon: "ri-delete-bin-6-line", title: "Auto-Delete", description: "Messages delete after 2 hours for security." },
    { icon: "ri-code-s-slash-line", title: "Open Source", description: "K9Crypt is open source and available on GitHub." }
  ];
</script>

<div class="py-16 relative">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-6">Why Choose K9Crypt?</h2>
    <p class="text-base text-center mb-6">We're a team of passionate developers who are dedicated to providing secure and reliable messaging solutions.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each items as item}
        <div class="p-4 rounded-lg border-2 border-dark-green hover:shadow-lg transition-shadow duration-300 relative">
          <h3 class="text-lg font-bold mb-2"><i class="{item.icon} mr-1"></i> {item.title}</h3>
          <p class="text-sm">{item.description}</p>
        </div>
      {/each}
    </div>
  </div>
</div>
