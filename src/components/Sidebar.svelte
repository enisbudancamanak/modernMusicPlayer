<script>
  import { goto } from '$app/navigation'
  import Icon from '@iconify/svelte'
  import { CURRENT_ITEM } from '../stores'

  function switchMenuItem(item) {
    goto(`/player/${item}`)
    CURRENT_ITEM.set(item)
  }

  export let playlists
</script>

<div class="h-full w-36 items-center flex flex-col gap-0 pt-2 pb-0 px-4">
  <!-- <div id="logo" class="flex pb-[41px]">
    <img src="/images/logo.png" class="w-[45px]" alt="" />
    <h1
      class="font-bold text-xl font-Quicksand self-end -mb-1.5 -ml-6 whitespace-nowrap"
    >
      Modern Spotify
    </h1>
  </div> -->
  <div class="flex flex-col items-center gap-2">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="menuItem"
      class:activeMenuItem={$CURRENT_ITEM === ''}
      on:mousedown={() => {
        switchMenuItem('')
      }}
    >
      <Icon icon="fluent:home-48-regular" class="iconMenuItem" />
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="menuItem"
      class:activeMenuItem={$CURRENT_ITEM === 'search'}
      on:mousedown={() => {
        switchMenuItem('search')
      }}
    >
      <Icon icon="fluent:search-48-regular" class="iconMenuItem" />
    </div>
    <div class="menuItem">
      <Icon icon="fluent:library-28-regular" class="iconMenuItem" />
    </div>
    <div class="menuItem">
      <Icon icon="fluent:heart-48-regular" class="iconMenuItem" />
    </div>
  </div>

  <hr class="w-full h-0.5 my-2 bg-black/20 border-0 rounded" />

  <div
    class="flex flex-col gap-3 py-2 w-full overflow-scroll items-center pl-1.5"
  >
    {#if playlists}
      {#each playlists as playlist}
        <div class="playlistItem">
          <img
            src={playlist.images[0].url}
            alt=""
            class="w-16 aspect-square hover:rounded-xl object-cover rounded-lg shadow-md transition-all duration-200"
          />
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  /* ===== Scrollbar CSS ===== */
  /* Firefox */
  * {
    scrollbar-width: auto;
    scrollbar-color: #1db95467 transparent;
  }

  *::-webkit-scrollbar-button {
    width: 0px;
    height: 0px;
  }
  *::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #1db95467;
    border-radius: 10px;
  }
</style>
