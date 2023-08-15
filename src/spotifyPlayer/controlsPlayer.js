import { player } from './initPlayer'
import {
  CURRENT_STATUS,
  DEVICE_ID,
  CURRENT_VOLUME,
  VOLUME__MUTE,
} from '../stores'
import { get } from 'svelte/store'

const REPEAT_MODE_ENUMS = ['off', 'context', 'track']

export function nextSong() {
  player.nextTrack()
}

export function previousSong() {
  player.previousTrack()
}

export function pauseSong() {
  player.togglePlay()
}

export function toggleMute() {
  VOLUME__MUTE.set(!get(VOLUME__MUTE))
  if (get(VOLUME__MUTE)) player.setVolume(0)
  else player.setVolume(get(CURRENT_VOLUME))
}

export function setVolume(e) {
  if (e.target.value > 0 && get(VOLUME__MUTE)) VOLUME__MUTE.set(false)
  const volume = !get(VOLUME__MUTE) ? e.target.value / 100 : 0
  player.setVolume(volume).then(() => {
    CURRENT_VOLUME.set(volume)
  })
}

export async function getVolume() {
  player.getVolume().then((volume) => {
    CURRENT_VOLUME.set(volume)
  })
}

export function setPosition(e) {
  const newPosition = (e.target.value / 100) * get(CURRENT_STATUS).duration
  player.seek(newPosition).then(() => {
    console.log('Changed position!')
  })
}

export async function startSong(context_uri, position_offset, accessToken) {
  await fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      context_uri: context_uri,
      offset: {
        position: position_offset,
      },
      position_ms: 0,
    }),
  }).then(() => {
    return true
  })
}

export async function toggleRepeat(accessToken) {
  const currState = get(CURRENT_STATUS)
  if (currState.repeat_mode >= 0 && currState.repeat_mode < 2)
    currState.repeat_mode += 1
  else currState.repeat_mode = 0

  await fetch(
    `https://api.spotify.com/v1/me/player/repeat?state=${
      REPEAT_MODE_ENUMS[currState.repeat_mode]
    }&device_id=${get(DEVICE_ID)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then(() => {
    return true
  })
}

export async function toggleShuffle(accessToken) {
  const currState = get(CURRENT_STATUS)
  await fetch(
    `https://api.spotify.com/v1/me/player/shuffle?state=${!currState.shuffle}&device_id=${get(
      DEVICE_ID
    )}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then(() => {
    return true
  })
}

export function updateIntervalPosition() {
  if (get(CURRENT_STATUS) != null) {
    let currState = get(CURRENT_STATUS)
    if (currState.paused) {
      return currState.position ? currState.position : 0
    }
    currState.position += 1000

    CURRENT_STATUS.set(currState)
  }
}
