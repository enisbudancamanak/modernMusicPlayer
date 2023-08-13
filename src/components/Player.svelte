<script>
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import ColorThief from 'colorthief'
  import Icon from '@iconify/svelte'
  import moment from 'moment'
  import { CURRENT_TRACK, CURRENT_STATUS, CURRENT_VOLUME } from '../stores'
  import { initPlayer, player } from '../spotifyPlayer/initPlayer'
  import {
    nextSong,
    pauseSong,
    previousSong,
    toggleShuffle,
    updateIntervalPosition,
    getVolume,
  } from '../spotifyPlayer/controlsPlayer'

  let song = null
  let currStatus = null

  export let accessToken

  $: if (browser) {
    initPlayer(accessToken)
  }

  $: if ($CURRENT_TRACK && $CURRENT_STATUS && player) {
    song = $CURRENT_TRACK
    currStatus = $CURRENT_STATUS

    setShadow()
    updateProgress()
    // getVolume()
  }

  let duration, progress, timer, volume
  let contentLoaded = false

  onMount(() => {
    duration = document.getElementById('duration')
    progress = document.getElementById('progress')
    volume = document.getElementById('volume')
    timer = document.getElementById('timer')
    contentLoaded = true

    setInterval(updateIntervalPosition, 1000)
  })

  function updateProgress() {
    try {
      const progressPercent = (currStatus.position / currStatus.duration) * 100
      progress.style.width = `${progressPercent}%`
      timer.textContent = formatDuration(currStatus.position)
    } catch (e) {}
  }

  $: if ($CURRENT_VOLUME) {
    try {
      volume.style.width = `${$CURRENT_VOLUME * 100}%`
    } catch (e) {}
  }

  function setShadow() {
    try {
      const colorThief = new ColorThief()
      const img = document.querySelector('#albumCover')
      const wrapper = document.querySelector('#wrapperAlbumCover')

      if (img.complete) {
        const color = colorThief.getColor(img)
        wrapper.style[
          'boxShadow'
        ] = `0px 0px 50px rgb(${color[0]} ${color[1]} ${color[2]})`
      } else {
        image.addEventListener('load', function () {
          const color = colorThief.getColor(img)
          wrapper.style[
            'boxShadow'
          ] = `0px 0px 50px rgb(${color[0]} ${color[1]} ${color[2]})`
        })
      }
    } catch (e) {}
  }

  function formatDuration(ms) {
    var duration = moment.duration(ms)
    if (duration.asHours() > 1) {
      return (
        Math.floor(duration.asHours()) +
        moment.utc(duration.asMilliseconds()).format(':mm:ss')
      )
    } else {
      return moment.utc(duration.asMilliseconds()).format('mm:ss')
    }
  }
</script>

<div
  class:songNotPlaying={!song}
  class="flex justify-between w-full h-full px-5 overflow-hidden text-black transition-all duration-75 bg-opacity-100 shadow-inner bg-white/70 rounded-4xl shadow-black font-Quicksand"
>
  <!-- SONG META -->
  <div
    style="flex-grow: 1; flex-basis: 0;"
    class="flex items-center h-full gap-5 w-max"
  >
    {#if song}
      <div id="wrapperAlbumCover" class="relative overflow-hidden rounded-2xl">
        <img
          crossorigin="anonymous"
          id="albumCover"
          src={song.album.images[0].url}
          alt=""
          class="object-cover w-24 aspect-square rounded-2xl"
        />
      </div>
      <div class="flex-col max-w-xs">
        <p class="text-lg font-semibold tracking-tight truncate">
          {song.name}
        </p>
        <p class="text-sm font-semibold leading-4 text-gray-800 truncate">
          {song.artists.map((_artist) => _artist.name).join(', ')}
        </p>
      </div>
    {/if}
  </div>

  <div class="flex flex-col items-center justify-center flex-1 h-full gap-2">
    <div class="flex items-center gap-8">
      <button on:mousedown={() => toggleShuffle(accessToken)}>
        <Icon
          icon={currStatus
            ? currStatus.shuffle
              ? 'fluent:arrow-shuffle-24-regular'
              : 'fluent:arrow-shuffle-offx-24-regular'
            : 'fluent:arrow-shuffle-24-regular'}
          class="w-auto h-6 controls"
        />
      </button>
      <div class="flex items-center gap-1">
        <button on:mousedown={previousSong}>
          <Icon icon="fluent:previous-24-regular" class="w-auto h-7 controls" />
        </button>
        <button on:mousedown={pauseSong}>
          <Icon
            icon={currStatus
              ? currStatus.paused
                ? 'fluent:play-circle-24-regular'
                : 'fluent:pause-circle-24-regular'
              : 'fluent:play-circle-24-regular'}
            class="w-auto h-10 controls"
          />
        </button>
        <button on:mousedown={nextSong}>
          <Icon icon="fluent:next-24-regular" class="w-auto h-7 controls" />
        </button>
      </div>
      <Icon
        icon="fluent:arrow-repeat-all-24-regular"
        class="w-auto h-6 controls"
      />
    </div>
    <div class="flex items-center justify-center w-full gap-4">
      <span id="timer">0:00</span>
      <div id="progress-container">
        <div id="progress" />
      </div>
      <span id="duration">
        {currStatus ? formatDuration(currStatus.duration) : '...'}
      </span>
    </div>
  </div>

  <div
    style="flex-grow: 1; flex-basis: 0;"
    class="flex items-center justify-end h-full gap-2 max-w"
  >
    <Icon icon={'fluent:speaker-2-48-filled'} class="w-auto h-6 controls" />
    <div id="volume-container">
      <input type="range" value="30" min="0" max="100" id="volume" />
    </div>
  </div>
</div>

<style>
  #progress-container {
    height: 4px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    border-radius: 8px;
  }

  #progress {
    background-color: #000;
    width: 0%;
    height: inherit;
    border-radius: inherit;
    transition: width 100ms ease-in;
  }

  #volume-container {
    height: 4px;
    width: 70px;
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    border-radius: 8px;
  }

  /* #volume {
    background-color: #000;
    width: 0%;
    height: inherit;
    border-radius: inherit;
    transition: width 100ms ease-in;
  } */

  #volume {
    appearance: none;
    width: 30px;
    height: 4px;
    border-radius: 8px;
    outline: none;
    transition: 0.2s;
    cursor: pointer;
    background: black;
    overflow: hidden;
  }

  #volume::-webkit-slider-thumb {
    appearance: none;
    visibility: hidden;
  }

  /* #volume:hover {
    height: 1em;
  } */

  .songNotPlaying {
    pointer-events: none;
    color: rgb(170, 170, 170);
    background-color: rgba(255 255 255 / 0.4);
  }
</style>
