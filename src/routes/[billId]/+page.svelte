<script lang="ts">
  import { goto } from '$app/navigation'
  import { getStorageData } from '@/lib/utils/ls'
  import { flip } from 'svelte/animate'
  import { fly } from 'svelte/transition'
  import IconPhFloppyDisk from '~icons/ph/floppy-disk'
  import IconPhPlus from '~icons/ph/plus'
  import IconPhX from '~icons/ph/x'
  import type { PageData } from './$types'

  interface BillItem {
    id: string
    name: string
    price: number
    amount: number
  }

  interface Bill {
    id: string
    label: string
    items: BillItem[]
    total: number
    createdAt: string
    updatedAt: string
  }

  let { data }: { data: PageData } = $props()
  $effect(() => {
    label = getStorageData(`bill-${data.billId}`, { label: '' }).label
    elementsList = getStorageData(`bill-${data.billId}`, { items: [] }).items
  })

  const createdAt = getStorageData(`bill-${data.billId}`, {
    createdAt: new Date().toISOString()
  }).createdAt

  let label = $state('')
  let elementsList = $state<BillItem[]>([])
  let total = $derived(
    elementsList.reduce((acc, el) => acc + el.price * el.amount, 0)
  )

  $effect(() => {
    if (total === 0 || label === '') return
    const bill: Bill = {
      id: data.billId,
      label,
      items: elementsList,
      total,
      updatedAt: new Date().toISOString(),
      createdAt
    }
    localStorage.setItem(`bill-${data.billId}`, JSON.stringify(bill))
  })

  function addTodo(e: SubmitEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = form.elName.value

    const existingElement = elementsList.find((el) => el.name === name)
    const id = existingElement ? existingElement.id : crypto.randomUUID()
    if (existingElement) {
      existingElement.amount += 1
    } else {
      const somethingCount = elementsList.filter((el) =>
        el.name.startsWith('Something')
      ).length
      const newElement = {
        id,
        name: name || `Something №${somethingCount + 1}`,
        price: form.price.value,
        amount: 1
      }
      elementsList.push(newElement)
    }

    form.reset()

    setTimeout(() => {
      const newElement = document.querySelector(`[data-todo-id="${id}"]`)
      newElement?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  function deleteTodo(id: string) {
    elementsList = elementsList.filter((el) => el.id !== id)
  }

  async function newBill() {
    const newBillId = crypto.randomUUID()
    await goto(`/${newBillId}`)
  }
</script>

<main class="flex w-full flex-col gap-2 overflow-x-hidden p-2 pb-20">
  <div class="flex items-center gap-2">
    <div class="grow rounded-lg border shadow-sm">
      <input
        class="border-primary h-10 w-full rounded-lg px-2 text-lg font-bold"
        bind:value={label}
        placeholder="Label"
      />
    </div>
    <button onclick={newBill} aria-label="Save" class="button size-10">
      <IconPhFloppyDisk />
    </button>
  </div>
  <div class="flex items-center justify-between">
    <i>Created at: {new Date(createdAt).toLocaleDateString()}</i>
    <h3>
      Total:
      <strong>{total}</strong>
    </h3>
  </div>

  <ul>
    {#each elementsList as el (el.id)}
      <li
        data-todo-id={el.id}
        in:fly={{ y: 80 }}
        out:fly={{ x: 13, duration: 150 }}
        animate:flip={{ duration: 200 }}
        class="bg-card relative mb-2 flex flex-col gap-2 rounded-lg border p-2 shadow-sm"
      >
        <input class="mr-6 border-b" bind:value={el.name} />
        <div class="flex items-center gap-1">
          <input
            type="number"
            class="h-10 w-24 rounded-md border px-1"
            step="1"
            min="1"
            bind:value={el.price}
          />
          <span class="text-muted-foreground">x</span>
          <div class="flex items-center rounded-md border">
            <button
              disabled={el.amount === 1}
              onclick={() => el.amount--}
              class="grid size-10 place-items-center border-r disabled:opacity-50"
            >
              -
            </button>
            <input
              type="number"
              class="h-10 w-10 px-1"
              bind:value={el.amount}
            />
            <button
              onclick={() => el.amount++}
              class="grid size-10 place-items-center border-l"
            >
              +
            </button>
          </div>
          <span class="text-muted-foreground"> = </span>
          <span class="min-w-12">
            {el.price * el.amount}
          </span>
        </div>
        <button
          class="text-muted-foreground absolute top-2 right-2 grid size-4 cursor-pointer place-items-center"
          aria-label="Delete"
          onclick={() => deleteTodo(el.id)}
        >
          <IconPhX width={16} height={16} />
        </button>
      </li>
    {:else}
      <i class="text-muted-foreground">No items</i>
    {/each}
  </ul>

  <form
    class="bg-card fixed inset-x-0 bottom-0 flex items-center gap-2 rounded-t-lg border px-2 py-4"
    onsubmit={addTodo}
  >
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
  </form>
</main>
