<script lang="ts">
  const faqs = [
    { question: "How secure is K9Crypt?", answer: "K9Crypt uses end-to-end encryption to ensure that your messages are secure and only accessible to you and the recipient." },
    { question: "Do I need an account to use K9Crypt?", answer: "No, you do not need an account to use K9Crypt. You can start sending secure messages right away." },
    { question: "How long are messages stored?", answer: "Messages are automatically deleted after 2 hours for security reasons." },
    { question: "Is K9Crypt open source?", answer: "Yes, K9Crypt is open source and available on GitHub. You can contribute to the project or review the code." },
    { question: "Can I create secure rooms for group chats?", answer: "Yes, you can create secure rooms for group chats and invite members to join using a unique link." }
  ];

  let activeIndex: number | null = null;

  function toggleAnswer(index: number | null) {
    if (activeIndex === index) {
      activeIndex = null;
    } else {
      activeIndex = index;
    }
  }
</script>

<div class="py-16 relative">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
    <p class="text-base text-center mb-6">Here are some common questions about K9Crypt.</p>
    <div class="flex flex-col space-y-4">
      {#each faqs as faq, index}
        <div class="p-4 rounded-lg border-2 border-dark-green hover:shadow-lg transition-shadow duration-300 relative">
          <button class="w-full text-left" on:click={() => toggleAnswer(index)}>
            <h3 class="text-lg font-bold mb-2 flex justify-between items-center">
              <span>{faq.question}</span>
              <span class="ml-2">{activeIndex === index ? '-' : '+'}</span>
            </h3>
          </button>
          {#if activeIndex === index}
            <p class="text-sm mt-2">{faq.answer}</p>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
