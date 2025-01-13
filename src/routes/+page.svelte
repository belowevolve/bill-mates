<script lang="ts">
  import { flip } from 'svelte/animate'
  import { fade, fly } from 'svelte/transition'
  import IconPhTrash from '~icons/ph/trash'

  let bills = $state(
    Object.keys(localStorage)
      .map((key) => JSON.parse(localStorage.getItem(key) || '{}'))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  )

  function deleteBill(e: MouseEvent, id: string) {
    e.preventDefault()
    localStorage.removeItem(`bill-${id}`)
    bills = bills.filter((bill) => bill.id !== id)
  }
</script>

<main class="w-full overflow-x-hidden p-2 pb-20">
  <ul class="flex flex-col gap-2">
    {#each bills as bill (bill.id)}
      <li out:fly={{ x: 13, duration: 150 }} animate:flip={{ duration: 200 }}>
        <h2 class="text-muted-foreground text-sm">
          {new Date(bill.createdAt).toLocaleDateString()}
        </h2>
        <a
          class="bg-card flex h-10 items-center gap-2 rounded-lg border pl-2 shadow-sm"
          href={`/${bill.id}`}
        >
          <span class="text-lg font-bold">{bill.label}</span>
          <span class="ml-auto block">Total: <strong>{bill.total}</strong></span
          >
          <button class="button" onclick={(e) => deleteBill(e, bill.id)}>
            <IconPhTrash />
          </button>
        </a>
      </li>
    {:else}
      <a
        in:fade
        href={`/${crypto.randomUUID()}`}
        class="text-center text-lg text-muted-foreground">Create a new bill</a
      >
    {/each}
  </ul>

  <a href={`/${crypto.randomUUID()}`} class="button fixed inset-x-2 bottom-4">
    Create a new bill
  </a>
</main>
