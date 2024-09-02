<script>
  import Footer from "../../components/Footer.svelte";
  import { onMount } from "svelte";

  let isPageLoading = true;

  onMount(() => {
    setTimeout(() => {
      isPageLoading = false;
    }, 1000);
  });
</script>

{#if isPageLoading}
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg flex items-center justify-center">
    <i class="ri-loader-3-line text-6xl animate-spin" style="animation: rotate 1s linear infinite;"></i>
  </div>
</section>

<style>
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
{:else}
<section class="py-12">
  <div class="max-w-4xl mx-auto px-4">
    <h2 class="text-2xl font-bold text-center mb-3">Privacy Policy</h2>
    <p class="text-sm text-dark-green/70 mb-6 text-center">Last updated: July 29, 2024</p>
    <div class="p-6 rounded-lg border-2 border-dark-green">
      <h3 class="text-xl font-semibold mb-4">Our Commitment to Your Privacy</h3>
      <p class="mb-4">
        At K9Crypt, we are committed to providing a secure and anonymous messaging platform. Our service is designed with your privacy as the top priority.
      </p>

      <h4 class="text-lg font-semibold mb-2">1. No Account Required</h4>
      <p class="mb-4">
        In line with our "No Account Needed" policy, we do not collect or store any personal information. You can start using our service immediately without creating an account or providing any personal details.
      </p>

      <h4 class="text-lg font-semibold mb-2">2. End-to-End Encryption</h4>
      <p class="mb-4">
        We use state-of-the-art end-to-end encryption (E2E) for all messages. This means that only the intended recipient can read the message content. Even we, as the service provider, cannot access or read your messages.
      </p>

      <h4 class="text-lg font-semibold mb-2">3. Automatic Message Deletion</h4>
      <p class="mb-4">
        For enhanced security, all messages are automatically deleted from our servers every 2 hours. This "Auto-Delete" feature ensures that your sensitive information is not stored longer than necessary.
      </p>

      <h4 class="text-lg font-semibold mb-2">4. How It Works and Your Privacy</h4>
      <p class="mb-4">
        Our service operates in four simple steps:
      </p>
      <ol class="list-decimal list-inside ml-4 mb-4">
        <li>You write your message</li>
        <li>Our system generates a random password</li>
        <li>You share the secure link</li>
        <li>The recipient accesses the message using the link and password</li>
      </ol>
      <p class="mb-4">
        At no point in this process do we collect or store any personal data or message content beyond the 2-hour period.
      </p>

      <h4 class="text-lg font-semibold mb-2">5. Data We Do Not Collect</h4>
      <p class="mb-4">
        We do not collect, store, or have access to:
      </p>
      <ul class="list-decimal list-inside ml-4 mb-4">
        <li>Your personal information</li>
        <li>The content of your messages</li>
        <li>Your IP address or location data</li>
        <li>Any metadata related to your messages</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6. Unlimited Message and Room Creation</h4>
      <p class="mb-4">
        There are no restrictions on the number of messages or rooms you can create. You're free to use our service as often as you need, always with the same level of privacy and security.
      </p>

      <h4 class="text-lg font-semibold mb-2">7. Room Privacy</h4>
      <p class="mb-4">
        When you create a room, no personal data is collected. Room IDs and user IDs are used solely for the purpose of facilitating the messaging service. These identifiers are not stored beyond the session and are not used for tracking or profiling users.
      </p>

      <h4 class="text-lg font-semibold mb-2">8. Your Responsibility</h4>
      <p class="mb-4">
        While we take every measure to ensure the security of our platform, the security of the shared links, passwords, room IDs, and user IDs is your responsibility. Please ensure you share these securely with your intended recipients.
      </p>

      <h4 class="text-lg font-semibold mb-2">9. Open Source Transparency</h4>
      <p class="mb-4">
        K9Crypt is an open-source project. Our commitment to transparency means that anyone can review, audit, and contribute to our codebase. You can find our source code on our GitHub repository:
      </p>
      <p class="mb-4">
        <a href="https://github.com/k9crypt" class="text-dark-green/70 underline" target="_blank" rel="noopener noreferrer">https://github.com/k9crypt</a>
      </p>
      <p class="mb-4">
        This open-source approach allows for:
      </p>
      <ul class="list-decimal list-inside ml-4 mb-4">
        <li>Community-driven security audits</li>
        <li>Verification of our privacy claims</li>
        <li>Continuous improvement through community contributions</li>
        <li>Greater trust and transparency in our service</li>
      </ul>
      <p class="mb-4">
        We encourage users to review our code and contribute to the project if they wish. This level of transparency further underscores our commitment to providing a secure and private messaging service.
      </p>

      <p class="text-sm text-dark-green/70 mt-6">
        By using K9Crypt, you agree to this privacy policy. If you have any questions or concerns, please contact us.
      </p>
    </div>
  </div>
</section>
{/if}

<Footer />