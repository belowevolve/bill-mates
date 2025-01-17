<script lang="ts">
  import IconPhUserPlus from '~icons/ph/user-plus'
  import IconPhX from '~icons/ph/x'

  let {
    addMate,
    className
  }: { addMate: (mate?: string) => void; className: string } = $props()

  let dialogEl = $state<HTMLDialogElement>()

  function showDialog() {
    dialogEl?.showModal()
  }

  function closeDialog() {
    dialogEl?.close()
  }

  function handleSubmit(e: SubmitEvent) {
    const form = e.target as HTMLFormElement
    const mateName = form.mateName.value.trim()

    addMate(mateName)

    form.reset()
  }
</script>

<button
  type="button"
  class={`${className} button size-10`}
  onclick={showDialog}
  aria-label="Add mate"
>
  <IconPhUserPlus />
</button>
<!-- fastest way to close dialog by outside click-->
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
    <div class="flex justify-between">
      <h2 id="dialog-header">Add a new mate</h2>
    </div>
    <label class="sr-only" for="mateName">Mate name</label>
    <input
      id="mateName"
      placeholder="Mate name"
      class="input"
      name="mateName"
      required
    />

    <div class="flex justify-end gap-2">
      <button type="reset" class="button-ghost w-20" onclick={closeDialog}>
        Cancel
      </button>
      <button type="submit" class="button w-20">Add</button>
    </div>

    <button
      type="reset"
      class="absolute top-0 right-0 size-6"
      onclick={closeDialog}
    >
      <IconPhX width={20} />
    </button>
  </form>
</dialog>
