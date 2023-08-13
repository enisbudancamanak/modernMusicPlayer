<script>
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  var redirect_uri = 'http://localhost:5173/'

  onMount(async () => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('code')) {
      const code = params.get('code')
      await fetch('api/accessToken?code=' + code).then(async (res) => {
        if (res.status === 404) {
          //ERROR
        } else {
          goto('/player')
        }
      })
    }
  })

  function authorize() {
    const params = new URLSearchParams()
    params.append('client_id', CLIENT_ID)
    params.append('response_type', 'code')
    params.append('redirect_uri', redirect_uri)
    params.append(
      'scope',
      'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-read-private playlist-read-collaborative user-library-modify user-library-read user-follow-read user-read-private user-read-email'
    )
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`
  }
</script>

<button type="button" on:click={authorize}>LOG IN</button>
