import { player } from './initPlayer'
import { CURRENT_STATUS, DEVICE_ID, CURRENT_VOLUME } from '../stores'
import { get } from 'svelte/store'

export function nextSong() {
  player.nextTrack()
}

export function previousSong() {
  player.previousTrack()
}

export function pauseSong() {
  player.togglePlay()
}

export function setVolume(volume) {
  player.setVolume(volume).then(() => {
    console.log('Volume updated!')
  })
}

export async function getVolume() {
  player.getVolume().then((volume) => {
    CURRENT_VOLUME.set(volume)
  })
}

export async function setRepeat(option, device_id, accessToken) {
  await fetch(
    `https://api.spotify.com/v1/me/player/repeat?state=${option}&device_id=${device_id}`,
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

export function changePosition() {
  player.seek(60 * 1000).then(() => {
    //minute
    console.log('Changed position!')
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
