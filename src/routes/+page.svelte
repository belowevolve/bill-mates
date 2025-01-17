<script lang="ts">
  import { getHistoryBills } from '@entities/bill'
  import { removeStorageData } from '@utils/ls'
  import { flip } from 'svelte/animate'
  import { fade, fly } from 'svelte/transition'
  import IconPhX from '~icons/ph/x'

  let bills = $state(getHistoryBills())

  function deleteBill(e: MouseEvent, id: string) {
    e.preventDefault()
    removeStorageData(`bill-${id}`)
    bills = bills.filter((bill) => bill.id !== id)
  }
</script>

<h1>History</h1>
<ul class="flex flex-col gap-2">
  {#each bills as bill (bill.id)}
    <li out:fly={{ x: 13, duration: 150 }} animate:flip={{ duration: 200 }}>
      <a
        class="bg-card relative block rounded-lg border p-2 pr-5 shadow-sm"
        href={`/${bill.id}`}
      >
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold">
            {bill.label ? bill.label : '...'}
          </span>
          <span class="ml-auto block">
            Total: <strong>{bill.total}</strong>
          </span>
          <!-- <button class="button" onclick={(e) => deleteBill(e, bill.id)}>
            <IconPhTrash />
          </button> -->
        </div>
        <div class="flex gap-2">
          <span class="text-pretty">
            {#each Object.keys(bill.matesItems) as mate, i}
              {mate}{i === Object.keys(bill.matesItems).length - 1 ? '' : ', '}
            {/each}
          </span>
          <i class="ml-auto text-sm font-bold">
            {new Date(bill.createdAt).toLocaleDateString()}
          </i>
        </div>
        <button
          class="text-muted-foreground absolute top-0.5 right-0.5 size-4"
          aria-label={`Delete ${bill.label}`}
          onclick={(e) => deleteBill(e, bill.id)}
        >
          <IconPhX width={16} height={16} />
        </button>
      </a>
    </li>
  {:else}
    <a
      in:fade
      href={`/${crypto.randomUUID()}`}
      class="text-center italic text-muted-foreground"
    >
      Create a new bill
    </a>
  {/each}
</ul>

<div class="fixed-holder">
  <a href={`/${crypto.randomUUID()}`} class="button flex justify-center">
    Create a new bill
  </a>
</div>
