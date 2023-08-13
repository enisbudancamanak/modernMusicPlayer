<script>
  import Sidebar from '../../components/Sidebar.svelte'
  import Content from '../../components/Content.svelte'
  import Player from '../../components/Player.svelte'
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'

  export let data

  onMount(() => {})
</script>

<div class="w-screen h-screen px-12 py-6">
  <div
    class="flex flex-col w-full h-full pt-4 pr-4 glasmorphism bg-gradient-to-br from-greenBackground/90 via-greenBackground/40 to-greenBackground/20"
  >
    <div class="flex flex-1 overflow-auto">
      <Sidebar playlists={data.playlists} />
      <Content>
        <slot />
      </Content>
    </div>

    <footer class="w-full py-3 pl-4 h-36">
      <Player accessToken={data.accessToken} />
    </footer>
  </div>
</div>
