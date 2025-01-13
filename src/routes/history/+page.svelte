<script lang="ts">
  import { flip } from 'svelte/animate'
  import { fade, fly } from 'svelte/transition'
  import IconPhTrash from '~icons/ph/trash'
  let bills = $state(
    Object.keys(localStorage).map((key) =>
      JSON.parse(localStorage.getItem(key) || '{}')
    )
  )
  function deleteBill(e: MouseEvent, id: string) {
    e.preventDefault()
    localStorage.removeItem(`bill-${id}`)
    bills = bills.filter((bill) => bill.id !== id)
  }
</script>

<main class="p-2">
  <ul class="flex flex-col gap-2">
    {#each bills as bill (bill.id)}
      <a
        in:fly={{ y: 80 }}
        out:fly={{ x: 13, duration: 150 }}
        animate:flip={{ duration: 200 }}
        class="bg-card flex h-10 items-center gap-2 rounded-lg border pl-2 shadow-sm"
        href={`/${bill.id}`}
      >
        <span class="text-lg font-bold">{bill.label}</span>
        <span class="ml-auto block">Total: <strong>{bill.total}</strong></span>
        <button class="button" onclick={(e) => deleteBill(e, bill.id)}>
          <IconPhTrash />
        </button>
      </a>
    {:else}
      <a in:fade class="button" href={`/${crypto.randomUUID()}`}
        >Create a new one</a
      >
    {/each}
  </ul>
</main>
