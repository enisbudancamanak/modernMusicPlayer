import { CURRENT_TRACK, CURRENT_STATUS, DEVICE_ID } from '../stores'

export function initPlayer(accessToken) {
  // @ts-ignore
  window.onSpotifyWebPlaybackSDKReady = () => {
    player = new window.Spotify.Player({
      name: 'Web Playback SDK',
      getOAuthToken: (cb) => {
        cb(accessToken)
      },
    })

    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id)
      DEVICE_ID.set(device_id)
      connectDevice(device_id, accessToken)
    })

    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id)
    })

    player.addListener('initialization_error', ({ message }) => {
      console.error(message)
    })

    player.addListener('authentication_error', ({ message }) => {
      console.error(message)
    })

    player.addListener('account_error', ({ message }) => {
      console.error(message)
    })

    player.addListener('player_state_changed', (state) => {
      try {
        CURRENT_TRACK.set(state.track_window.current_track)
        // @ts-ignore
        CURRENT_STATUS.set({
          paused: state.paused,
          position: state.position,
          shuffle: state.shuffle,
          duration: state.duration,
          repeat_mode: state.repeat_mode,
        })
      } catch (e) {}
    })

    player.connect()
  }
}

function connectDevice(device_id, accessToken) {
  fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      device_ids: [device_id],
    }),
  })
}

export let player
