<script>
    import { goto } from "$app/navigation";
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">
    <h1 class="text-3xl font-bold mb-4 md:text-4xl">Where do you wanna go?</h1>
    <p class="text-lg mb-6 md:text-xl">Choose one of the options below.</p>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="flex flex-col gap-3 md:flex-row md:gap-4">
        <div on:click={() => goto('/create/room')} class="w-full h-14 border-2 border-dark-green rounded-lg cursor-pointer md:w-64 md:h-14">
            <div class="flex items-center justify-center h-full">
                <p class="text-sm text-center md:text-lg">Create Room</p>
            </div>
        </div>
        <div on:click={() => goto('/create/message')} class="w-full h-14 border-2 border-dark-green rounded-lg cursor-pointer md:w-64 md:h-14">
            <div class="flex items-center justify-center h-full">
                <p class="text-sm text-center md:text-lg">Encrypt Message</p>
            </div>
        </div>
        <div on:click={() => goto('/view')} class="w-full h-14 border-2 border-dark-green rounded-lg cursor-pointer md:w-64 md:h-14">
            <div class="flex items-center justify-center h-full">
                <p class="text-sm text-center md:text-lg">Decrypt Message</p>
            </div>
        </div>
    </div>
    <p class="mt-6 text-sm">Or <a href="/join/room" class="underline">join a room</a></p>
  </div>
</div>