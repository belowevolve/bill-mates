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

<div class="centered">
  <h1>todos</h1>

  <form onsubmit={addTodo} use:enhance>
    <label>
      add a todo:
      <input name="description" autocomplete="off" required />
    </label>
  </form>

  <ul class="mt-4">
    {#each todos as todo (todo.id)}
      <li
        in:fly={{ y: 20 }}
        out:slide
        class="bg-bg-1 mb-2 flex items-center gap-2 rounded-md p-2 shadow-md"
      >
        <span class="flex-1">{todo.description}</span>
        <button aria-label="Mark as complete" onclick={() => deleteTodo(todo.id)}></button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .centered {
    max-width: 20em;
    margin: 0 auto;
  }

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
