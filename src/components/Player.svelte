<script>
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import ColorThief from 'colorthief'
  import Icon from '@iconify/svelte'
  import moment from 'moment'
  import gsap from 'gsap'
  import {
    CURRENT_TRACK,
    CURRENT_STATUS,
    CURRENT_VOLUME,
    VOLUME__MUTE,
  } from '../stores'
  import { initPlayer, player } from '../spotifyPlayer/initPlayer'
  import {
    nextSong,
    pauseSong,
    previousSong,
    toggleShuffle,
    toggleRepeat,
    updateIntervalPosition,
    toggleMute,
    setVolume,
    setPosition,
  } from '../spotifyPlayer/controlsPlayer'

  let song = null
  let currStatus = null
  export let accessToken

  $: if (browser) {
    initPlayer(accessToken)
  }

  $: if ($CURRENT_TRACK || $CURRENT_STATUS) {
    song = $CURRENT_TRACK
    currStatus = $CURRENT_STATUS
    setShadow()
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

  // TODO: Fix constantly updating the shadow of the album cover
  /**
   * Set the shadow of the album cover
   * @returns {void}
   * @description Get the dominant color of the album cover and set it as the shadow of the album cover
   */
  function setShadow() {
    try {
      const colorThief = new ColorThief()
      const img = document.querySelector('#albumCover')
      const wrapper = document.querySelector('#wrapperAlbumCover')

      if (img.complete) {
        const color = colorThief.getColor(img)

        gsap.to('#player', {
          duration: 0.2,
          ease: 'linear',
          backgroundImage: `linear-gradient(to right, rgba(
          ${color[0]},
          ${color[1]},
          ${color[2]}, 0.5
        ), rgba(
          ${color[0]},
          ${color[1]},
          ${color[2]}, 0.05
        )`,
        })

        wrapper.style[
          'boxShadow'
        ] = `0px 0px 50px rgb(${color[0]} ${color[1]} ${color[2]})`
      } else {
        // image.addEventListener('load', function () {
        //   const color = colorThief.getColor(img)
        //   // currentShadowColor = rgbToHex(color[0], color[1], color[2])
        //   wrapper.style[
        //     'boxShadow'
        //   ] = `0px 0px 50px rgb(${color[0]} ${color[1]} ${color[2]})`
        // })
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

  function checkRepeatIcon(repeat_mode) {
    switch (repeat_mode) {
      case 0:
        return 'fluent:arrow-repeat-all-off-24-regular'
        break
      case 1:
        return 'fluent:arrow-repeat-all-24-regular'
        break
      case 2:
        return 'fluent:arrow-repeat-1-24-regular'
        break
    }
  }

  function checkVolumeIcon(volume, mute) {
    if (volume == 0 || mute) return 'fluent:speaker-mute-48-regular'
    else if (volume > 0 && volume < 0.3) return 'fluent:speaker-0-48-regular'
    else if (volume >= 0.3 && volume < 0.6) return 'fluent:speaker-1-48-regular'
    else if (volume >= 0.6 && volume <= 1) return 'fluent:speaker-2-48-regular'
    else return 'fluent:speaker-1-32-regular'
  }

  const rgbToHex = (r, g, b) =>
    '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
</script>

<div
  id="player"
  class:songNotPlaying={!song}
  class="flex justify-between w-full h-full px-5 overflow-hidden transition-all duration-75 bg-white bg-opacity-100 shadow-sm text-primary rounded-4xl shadow-primary font-Quicksand"
>
  <!-- LEFT -->
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

  <!-- CENTER -->
  <div class="flex flex-col items-center justify-center flex-1 h-full gap-2">
    <div class="flex items-center gap-8">
      <button on:mousedown={() => toggleShuffle(accessToken)}>
        <Icon
          icon={currStatus
            ? currStatus.shuffle
              ? 'fluent:arrow-shuffle-24-regular'
              : 'fluent:arrow-shuffle-off-24-regular'
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
      <button on:mousedown={() => toggleRepeat(accessToken)}>
        <Icon
          icon={currStatus
            ? checkRepeatIcon(currStatus.repeat_mode)
            : 'fluent:arrow-repeat-all-off-24-regular'}
          class="w-auto h-6 controls"
        />
      </button>
    </div>
    <div class="flex items-center justify-between w-full gap-4">
      <span class="min-w-[32px]" id="timer"
        >{currStatus ? formatDuration(currStatus.position) : '0:00'}</span
      >
      <input
        on:change={setPosition}
        type="range"
        min="0"
        max="100"
        value={currStatus
          ? (currStatus.position / currStatus.duration) * 100
          : 0}
        class="range range-primary bg-[#959894] range-xs shadow-inner shadow-primary"
      />
      <span id="duration" class="w-14">
        {currStatus ? formatDuration(currStatus.duration) : '...'}
      </span>
    </div>
  </div>

  <!-- RIGHT -->
  <div
    style="flex-grow: 1; flex-basis: 0;"
    class="flex items-center justify-end h-full gap-2 max-w"
  >
    <button on:mousedown={toggleMute}>
      <Icon
        icon={checkVolumeIcon($CURRENT_VOLUME, $VOLUME__MUTE)}
        class="w-auto h-6 controls"
      />
    </button>
    <input
      on:change={setVolume}
      type="range"
      min="0"
      max="100"
      value={$VOLUME__MUTE ? 0 : $CURRENT_VOLUME * 100}
      class="range range-primary bg-[#959894] range-xs w-32 shadow-inner shadow-primary"
    />
  </div>
</div>

<style>
  .songNotPlaying {
    pointer-events: none;
    color: rgb(170, 170, 170);
    background-color: rgba(255 255 255 / 0.4);
  }

  .range::-webkit-slider-runnable-track {
    width: 100%;
    background-color: transparent;
  }
</style>
