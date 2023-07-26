<script>
  import Sidebar from '../../components/Sidebar.svelte'
  import Content from '../../components/Content.svelte'
  import Player from '../../components/Player.svelte'
</script>

<div class="w-screen h-screen py-14 px-12">
  <div
    class="h-full w-full flex flex-col glasmorphism bg-gradient-to-br from-greenBackground/90 via-greenBackground/40 to-greenBackground/20 px-4 pt-4"
  >
    <div class="flex flex-1 overflow-auto">
      <Sidebar />
      <Content>
        <slot />
      </Content>
    </div>

    <footer class="h-36 w-full py-4">
      <Player />
    </footer>
  </div>
</div>
