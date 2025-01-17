<script lang="ts">
  import IconPhX from '~icons/ph/x'

  let {
    mate,
    total,
    deleteMate,
    className
  }: {
    mate: string
    total: number
    deleteMate: (mate: string) => void
    className: string
  } = $props()

  let dialogEl = $state<HTMLDialogElement>()

  function showDialog() {
    dialogEl?.showModal()
  }

  function closeDialog() {
    dialogEl?.close()
  }

  function handleSubmit() {
    deleteMate(mate)
    closeDialog()
  }
</script>

<button
  type="button"
  class={`${className}`}
  onclick={() => (total > 0 ? showDialog() : deleteMate(mate))}
  aria-label="Delete mate"
>
  <IconPhX width={16} height={16} />
</button>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog
  onclick={(e) => e.target === dialogEl && closeDialog()}
  aria-labelledby="dialog-header"
  bind:this={dialogEl}
>
  <form
    class="relative flex flex-col gap-3"
    onsubmit={handleSubmit}
    method="dialog"
  >
    <h2 id="dialog-header">Delete mate</h2>

    <p class="text-pretty">
      Are you sure you want to delete a mate "{mate}" with total amount
      <b>{total}</b>?
    </p>

    <div class="flex justify-end gap-2">
      <button type="reset" class="button-ghost w-20" onclick={closeDialog}>
        Cancel
      </button>
      <button type="submit" class="button w-20 bg-red-500">Delete</button>
    </div>

    <button
      type="reset"
      class="absolute top-0 right-0 grid size-6 place-items-center"
      onclick={closeDialog}
    >
      <IconPhX width={20} />
    </button>
  </form>
</dialog>
