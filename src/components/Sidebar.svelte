<script>
  import { goto } from '$app/navigation'
  import Icon from '@iconify/svelte'
  import { CURRENT_ITEM } from '../stores'

  function switchMenuItem(item) {
    goto(`/player/${item}`)
    CURRENT_ITEM.set(item)
  }
</script>

<div class="h-full w-72 items-center flex flex-col gap-0 py-4 px-6">
  <div id="logo" class="flex pb-[41px]">
    <img src="/images/logo.png" class="w-[45px]" alt="" />
    <h1
      class="font-bold text-xl font-Quicksand self-end -mb-1.5 -ml-6 whitespace-nowrap"
    >
      Modern Spotify
    </h1>
  </div>

  <div class="flex flex-col items-center gap-2 w-full">
    <button
      class="menuItem"
      class:activeMenuItem={$CURRENT_ITEM === ''}
      on:mousedown={() => {
        switchMenuItem('')
      }}
    >
      <Icon icon="fluent:home-48-regular" class="iconMenuItem" />
      Discover
    </button>
    <button
      class="menuItem"
      class:activeMenuItem={$CURRENT_ITEM === 'search'}
      on:mousedown={() => {
        switchMenuItem('search')
      }}
    >
      <Icon icon="fluent:search-48-regular" class="iconMenuItem" />
      Search
    </button>
    <div class="menuItem">
      <Icon icon="fluent:library-28-regular" class="iconMenuItem" />
      Your Library
    </div>
    <div class="menuItem">
      <Icon icon="fluent:heart-48-regular" class="iconMenuItem" />
      Liked Songs
    </div>
  </div>

  <hr class="w-full h-0.5 my-4 bg-black/20 border-0 rounded" />

  <div class="flex flex-col gap-0 w-full overflow-y-scroll">
    {#each Array(20) as element}
      <div class="playlistItem">
        <Icon icon="material-symbols:library-music-rounded" class="" />
        Playlist
      </div>
    {/each}
  </div>
</div>

<style>
  /* ===== Scrollbar CSS ===== */
  /* Firefox */
  * {
    scrollbar-width: auto;
    scrollbar-color: #1db954 transparent;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 8px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #1db954;
    border-radius: 10px;
  }
</style>
