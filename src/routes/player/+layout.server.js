const now_playing_endpoint = `https://api.spotify.com/v1/me/player/currently-playing`
const playlists_endpoint = `https://api.spotify.com/v1/me/playlists`

export async function load({ fetch, locals }) {
  if (locals.accessToken) {
    const { playlists } = await fetchPlaylists(locals.accessToken)
    // const { me } = await fetchMe(locals.accessToken)
    // console.log(me)

    return {
      playlists: playlists.items,
      // me: me,
      accessToken: locals.accessToken,
    }
  }
}

async function fetchNowPlaying(access_token) {
  try {
    const res = await fetch(now_playing_endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
      },
    })

    const nowPlaying = await res.json()

    if (res.ok) {
      return {
        nowPlaying,
      }
    }
  } catch (err) {
    return {
      status: 404,
      error: new Error('Failed to fetch data'),
    }
  }
}

async function fetchPlaylists(access_token) {
  const res = await fetch(playlists_endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
  })

  const playlists = await res.json()

  if (res.ok) {
    return {
      playlists,
    }
  }

  return {
    status: res.status,
    error: new Error('Failed to fetch data'),
  }
}

async function fetchMe(access_token) {
  const res = await fetch('https://api.spotify.com/v1/me/player', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
  })

  const me = await res.json()

  if (res.ok) {
    return {
      me,
    }
  }

  return {
    status: res.status,
    error: new Error('Failed to fetch data'),
  }
}
