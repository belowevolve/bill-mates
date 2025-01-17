<script lang="ts">
  let { createdAt, total }: { createdAt: string; total: number } = $props()
</script>

<div class="flex items-center justify-between">
  <i>
    Created at: {new Date(createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })}
  </i>
  <h3>
    Total:
    <strong>{total}</strong>
  </h3>
</div>
