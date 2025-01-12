<script lang="ts">
  import { enhance } from '$app/forms'
  import { fly, slide } from 'svelte/transition'

  let todos = $state<{ id: string; description: string }[]>([])

  function addTodo(e: SubmitEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    todos.push({ id: crypto.randomUUID(), description: form.description.value })
    form.reset()
  }

  function deleteTodo(id: string) {
    todos = todos.filter((todo) => todo.id !== id)
  }
</script>

<ul>
  {#each todos as todo (todo.id)}
    <li
      in:fly={{ y: 20 }}
      out:slide
      class="bg-card mb-2 flex items-center gap-2 rounded-md p-2 shadow-md"
    >
      <span class="flex-1">{todo.description}</span>
      <button aria-label="Mark as complete" onclick={() => deleteTodo(todo.id)}></button>
    </li>
  {/each}
</ul>

<form class="bg-card fixed inset-x-0 bottom-0 rounded-xl border p-4" onsubmit={addTodo} use:enhance>
  <label class="flex items-center gap-2">
    <span class="shrink-0">add a todo:</span>
    <input class="w-full border-b" name="description" autocomplete="off" required />
  </label>
</form>

<style>
  button {
    border: none;
    background: url(/remove.svg) no-repeat 50% 50%;
    background-size: 1rem 1rem;
    width: 40px;
    cursor: pointer;
    height: 100%;
    aspect-ratio: 1;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  button:hover {
    opacity: 1;
  }
</style>
