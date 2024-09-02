<script>
  const messageSteps = [
    { icon: "ri-message-3-line", title: "Write Your Message", description: "Enter the message you want to send securely." },
    { icon: "ri-shield-keyhole-line", title: "Get Random Password", description: "System generates a random password for your message." },
    { icon: "ri-share-line", title: "Share the Link", description: "Share the generated secure link with the recipient." },
    { icon: "ri-lock-2-line", title: "Recipient Access", description: "Recipient uses the link and password to access the message." }
  ];

  const roomSteps = [
    { icon: "ri-home-4-line", title: "Create a Room", description: "Set up a secure room for your conversations." },
    { icon: "ri-key-2-line", title: "Invite Members", description: "Invite members to join your room with a unique link." },
    { icon: "ri-chat-3-line", title: "Start Chatting", description: "Begin secure conversations within your room." },
    { icon: "ri-timer-line", title: "Auto-Delete", description: "Messages in the room are automatically deleted after a set time." }
  ];
</script>

<div class="py-16 relative">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-6">How It Works</h2>
    <p class="text-base text-center mb-2">Learn how to securely send messages and create rooms with K9Crypt.</p>

    <h3 class="font-semibold mb-2"><i class="ri-corner-up-right-line"></i> Messages</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each messageSteps as step, index}
        <div class="p-4 rounded-lg border-2 border-dark-green hover:shadow-lg transition-shadow duration-300 relative">
          <span class="absolute top-0 right-0 bg-dark-green text-white px-2 py-1 text-sm">{index + 1}</span>
          <h3 class="text-lg font-bold mb-2"><i class="{step.icon} mr-1"></i> {step.title}</h3>
          <p class="text-sm">{step.description}</p>
        </div>
      {/each}
    </div>

    <h3 class="font-semibold mt-12 mb-2"><i class="ri-corner-up-right-line"></i> Rooms</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each roomSteps as step, index}
        <div class="p-4 rounded-lg border-2 border-dark-green hover:shadow-lg transition-shadow duration-300 relative">
          <span class="absolute top-0 right-0 bg-dark-green text-white px-2 py-1 text-sm">{index + 1}</span>
          <h3 class="text-lg font-bold mb-2"><i class="{step.icon} mr-1"></i> {step.title}</h3>
          <p class="text-sm">{step.description}</p>
        </div>
      {/each}
    </div>
  </div>
</div>
