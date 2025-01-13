<script lang="ts">
  import { goto } from '$app/navigation'
  import '@/app.css'
  import '@fontsource/geist-sans'
  import { onMount } from 'svelte'
  import IconPhInvoice from '~icons/ph/invoice'
  let { children } = $props()

  async function detectSWUpdate() {
    const registration = await navigator.serviceWorker.ready
    registration.addEventListener('updatefound', () => {
      const newSW = registration.installing
      newSW?.addEventListener('statechange', () => {
        if (newSW?.state === 'installed') {
          if (confirm('New version available! Reload to update?')) {
            newSW.postMessage({ type: 'SKIP_WAITING' })
            window.location.reload()
          }
        }
      })
    })
  }

  onMount(() => detectSWUpdate())

  async function newBill() {
    const newBillId = crypto.randomUUID()
    await goto(`/${newBillId}`)
  }
</script>

<nav class="flex items-center justify-between border-b p-4">
  <button class="flex items-center gap-0.5" onclick={newBill}>
    <IconPhInvoice />
    <h1>Bill-Mates</h1>
  </button>
  <a href="/history">History</a>
</nav>

{@render children()}
