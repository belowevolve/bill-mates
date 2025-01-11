<script lang="ts">
  import '@/app.css'
  import { onMount } from 'svelte'

  async function detectSWUpdate() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => {
          console.log('ServiceWorker registration successful')
        })
        .catch((err) => {
          console.log('ServiceWorker registration failed: ', err)
        })
    }
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
</script>

<slot />

<svelte:head>
  <title>Bill-Mates</title>
</svelte:head>
