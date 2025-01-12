<script lang="ts">
  import { flip } from 'svelte/animate'
  import { fly } from 'svelte/transition'
  import IconPhPlus from '~icons/ph/plus'
  import IconPhTrash from '~icons/ph/trash'

  let todos = $state<{ id: string; description: string }[]>([
    { id: 'a', description: 'a' },
    { id: 'b', description: 'b' },
    { id: 'c', description: 'c' },
    { id: 'd', description: 'd' },
    { id: 'e', description: 'e' },
    { id: 'f', description: 'f' },
    { id: 'g', description: 'g' },
    { id: 'h', description: 'h' },
    { id: 'i', description: 'i' },
    { id: 'j', description: 'j' }
  ])

  function addTodo(e: SubmitEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const newTodo = {
      id: crypto.randomUUID(),
      description: form.description.value
    }
    todos.push(newTodo)
    form.reset()

    setTimeout(() => {
      const newElement = document.querySelector(
        `[data-todo-id="${newTodo.id}"]`
      )
      newElement?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  function deleteTodo(id: string) {
    todos = todos.filter((todo) => todo.id !== id)
  }
</script>

<main class="pb-20">
  <ul class="p-4">
    {#each todos as todo (todo.id)}
      <li
        data-todo-id={todo.id}
        in:fly={{ y: 80 }}
        out:fly={{ x: 13, duration: 150 }}
        animate:flip={{ duration: 200 }}
        class="bg-card mb-2 flex items-center gap-2 rounded-md p-2 shadow-md"
      >
        <span class="flex-1">{todo.description}</span>
        <button
          class="text-muted-foreground grid size-10 place-items-center"
          aria-label="Delete"
          onclick={() => deleteTodo(todo.id)}
        >
          <IconPhTrash />
        </button>
      </li>
    {/each}
  </ul>

  <form
    class="bg-card fixed bottom-0 flex w-full items-center gap-2 rounded-t-lg border p-4"
    onsubmit={addTodo}
  >
    <input
      class="w-full border-b"
      name="description"
      autocomplete="off"
      required
    />
    <button type="submit" class="button size-10 shrink-0">
      <IconPhPlus width={20} height={20} />
    </button>
  </form>
</main>
