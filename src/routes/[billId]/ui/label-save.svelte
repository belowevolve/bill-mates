<script lang="ts">
  import { goto } from '$app/navigation'
  import IconPhFloppyDisk from '~icons/ph/floppy-disk'
  let { label = $bindable('') }: { label: string } = $props()
  async function newBill() {
    const newBillId = crypto.randomUUID()
    await goto(`/${newBillId}`)
  }
</script>

<div class="flex items-center gap-2">
  <input
    class="input text-lg font-bold"
    name="label"
    bind:value={label}
    aria-label="Label"
    placeholder="Label"
  />
  <button onclick={newBill} aria-label="Save" class="button size-10">
    <IconPhFloppyDisk />
  </button>
</div>
