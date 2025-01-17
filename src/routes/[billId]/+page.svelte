<script lang="ts">
  import type { Bill, BillItem } from '@entities/bill'
  import { getStorageData } from '@utils/ls'
  import { onMount } from 'svelte'
  import { flip } from 'svelte/animate'
  import { fly } from 'svelte/transition'
  import IconPhPlus from '~icons/ph/plus'
  import IconPhX from '~icons/ph/x'
  import type { PageData } from './$types'
  import AddMate from './ui/add-mate.svelte'
  import DeleteMate from './ui/delete-mate.svelte'
  import Info from './ui/info.svelte'
  import LabelSave from './ui/label-save.svelte'

  let { data }: { data: PageData } = $props()
  const createdAt = getStorageData(`bill-${data.billId}`, {
    createdAt: new Date().toISOString()
  }).createdAt

  let label = $state('')
  let matesItems = $state<Record<string, BillItem[]>>({})
  onMount(() => {
    label = getStorageData(`bill-${data.billId}`, { label: '' }).label
    matesItems = getStorageData(`bill-${data.billId}`, {
      matesItems: {
        Me: []
      }
    }).matesItems
  })

  const totals = $derived.by(() => {
    const byMate: Record<string, number> = {}
    let total = 0

    for (const [mate, items] of Object.entries(matesItems)) {
      let mateSum = 0
      for (const item of items) {
        const itemTotal = item.price * item.amount
        mateSum += itemTotal
        total += itemTotal
      }
      byMate[mate] = mateSum
    }

    return { byMate, total }
  })

  $effect(() => {
    if (totals.total === 0) return
    const bill: Bill = {
      id: data.billId,
      label,
      matesItems,
      total: totals.total,
      updatedAt: new Date().toISOString(),
      createdAt
    }
    localStorage.setItem(`bill-${data.billId}`, JSON.stringify(bill))
  })

  function addBill(e: SubmitEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = form.elName.value
    const price = form.price.value
    const selectedMates = Array.from(
      form.querySelectorAll<HTMLInputElement>(
        'input[name="selectedMate"]:checked'
      )
    ).map((input) => input.value)

    if (selectedMates.length === 0) return

    const id = crypto.randomUUID()
    const newElement: BillItem = {
      id,
      name: name || '...',
      price: Number(price),
      amount: 1
    }

    selectedMates.forEach((mate) => {
      if (!matesItems[mate]) matesItems[mate] = []
      matesItems[mate].push({ ...newElement })
    })

    form.elName.value = ''
    form.price.value = ''
  }

  function deleteMateItem(mate: string, itemId: string) {
    matesItems[mate] = matesItems[mate].filter((item) => item.id !== itemId)
  }

  function addMate(mate?: string) {
    if (!mate) return
    if (!matesItems[mate]) matesItems[mate] = []
  }

  function deleteMate(mate: string) {
    delete matesItems[mate]
  }
</script>

<LabelSave bind:label />
<Info {createdAt} total={totals.total} />

{#each Object.entries(matesItems) as [mate, items] (mate)}
  <div>
    <h2 class="inline">{mate}</h2>
    <span> - {totals.byMate[mate]}</span>
    <ul>
      {#each items as item (item.id)}
        <li
          in:fly={{ y: 80 }}
          out:fly={{ x: 16, duration: 150 }}
          animate:flip={{ duration: 150 }}
          data-item-id={item.id}
          class="bg-card relative mb-2 flex flex-col gap-2 rounded-lg border p-2 shadow-sm"
        >
          <input
            name="item-name"
            class="mr-6 border-b"
            bind:value={item.name}
          />
          <div class="flex items-center gap-1">
            <input
              name="item-price"
              type="number"
              class="h-10 w-24 rounded-md border px-1"
              step="1"
              min="1"
              bind:value={item.price}
            />
            <span class="text-muted-foreground">x</span>
            <div class="flex items-center rounded-md border">
              <button
                disabled={item.amount === 1}
                onclick={() => item.amount--}
                class="size-10 border-r disabled:opacity-50"
              >
                -
              </button>
              <input
                name="item-amount"
                type="number"
                class="h-10 w-10 px-1"
                bind:value={item.amount}
              />
              <button onclick={() => item.amount++} class="size-10 border-l">
                +
              </button>
            </div>
            <span class="text-muted-foreground"> = </span>
            <span class="min-w-12">
              {item.price * item.amount}
            </span>
          </div>
          <button
            class="text-muted-foreground absolute top-2 right-2 size-4"
            aria-label={`Delete ${item.name}`}
            onclick={() => deleteMateItem(mate, item.id)}
          >
            <IconPhX width={16} height={16} />
          </button>
        </li>
      {:else}
        <i class="text-muted-foreground text-center block">No items</i>
      {/each}
    </ul>
  </div>
{/each}

<form class="fixed-holder flex flex-col gap-2" onsubmit={addBill}>
  <div class="relative h-10">
    <div class="-m-1 flex gap-1 overflow-x-auto p-1 pr-13">
      {#each Object.keys(matesItems) as mate (mate)}
        <label
          class="bg-card has-checked:ring-primary has-focus-visible:border-primary hover:border-primary relative flex min-w-max cursor-pointer items-center gap-0.5 rounded-lg border p-2 pr-5 transition-all has-checked:ring"
        >
          <input
            type="checkbox"
            name="selectedMate"
            value={mate}
            class="sr-only"
          />
          {mate}
          <DeleteMate
            {mate}
            {deleteMate}
            total={totals.byMate[mate]}
            className="text-muted-foreground absolute top-0.5 right-0.5 size-4"
          />
        </label>
      {:else}
        <i class="leading-10 text-muted-foreground">Add a new mate</i>
      {/each}
    </div>
    <AddMate {addMate} className="absolute right-0 top-0" />
  </div>

  <div class="flex items-center gap-2">
    <input
      placeholder="Title"
      class="h-10 w-full border-b"
      name="elName"
      autocomplete="off"
    />
    <input
      type="number"
      step="1"
      min="1"
      placeholder="250"
      class="h-10 w-full border-b"
      name="price"
      required
    />
    <button type="submit" class="button size-10 shrink-0">
      <IconPhPlus width={20} height={20} />
    </button>
  </div>
</form>
