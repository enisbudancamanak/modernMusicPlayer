<script>
  import Icon from '@iconify/svelte'
</script>

<div class="flex justify-between gap-8 p-8 font-Quicksand">
  <div
    class="flex items-center flex-1 gap-2 px-4 py-2 border-2 shadow w-72 rounded-4xl bg-black/60 shadow-black border-green/20"
  >
    <Icon icon="fluent:search-28-regular" class="text-2xl text-white/80" />
    <input
      type="text"
      class="w-full text-lg bg-transparent outline-none text-white/60"
      placeholder="Search..."
    />
  </div>

  <div
    class="flex items-center justify-between gap-2 px-4 py-1.5 border-2 shadow min-w-min rounded-4xl bg-black/60 shadow-black border-green/20"
  >
    <div class="items-center gap-2 pr-4 avatar">
      <div class="w-8 border rounded-full border-green/60">
        <img src="/images/cover.jpeg" />
      </div>
      <p class="text-lg font-semibold text-white">Enisbu</p>
    </div>
    <Icon
      icon="akar-icons:chevron-down"
      class="text-2xl cursor-pointer text-white/80"
    />
  </div>
</div>
