<script>
  import { onMount } from 'svelte'
  import { CLIENT_ID, CLIENT_SECRET, LOGGED_IN } from '../stores'
  import { goto } from '$app/navigation'

  var AUTH_URL = 'https://accounts.spotify.com/authorize'
  var redirect_uri = 'http://localhost:5173/'

  onMount(() => {
    checkIfLoggedIn()
  })

  function checkIfLoggedIn() {
    if (localStorage.getItem('access_token') != null) {
      LOGGED_IN.set(true)
      goto('/player')
      return
    }

    const params = new URLSearchParams(window.location.search)
    if (params.has('code')) {
      const code = params.get('code')
      fetchAccessToken(code)
    }
  }

  // @ts-ignore
  function fetchAccessToken(code) {
    const body = {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code',
    }

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${$CLIENT_ID}:${$CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams(body),
    }

    fetch('https://accounts.spotify.com/api/token', config)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.access_token)
        console.log(data.refresh_token)
        console.log(data.expires_in)
        handleLocalStorage(data)
        window.history.pushState('', '', '/')
      })
      .catch((err) => {
        console.error(err)
        window.location.href = '/'
      })
  }

  // @ts-ignore
  function handleLocalStorage(data) {
    if (data.access_token != undefined)
      localStorage.setItem('access_token', data.access_token)
    if (data.refresh_token != undefined)
      localStorage.setItem('refresh_token', data.refresh_token)
    if (data.expires_in != undefined)
      localStorage.setItem('expires_in', data.expires_in)
    LOGGED_IN.set(true)
    goto('/player')
  }

  function authorize() {
    let url = AUTH_URL
    url += `?client_id=${$CLIENT_ID}`
    url += `&response_type=code`
    url += `&redirect_uri=${redirect_uri}`
    url += `&show_dialog=true`
    url += `&scope=user-read-private%20user-read-email%20playlist-read-private%20user-library-read%20user-read-playback-state%20user-modify-playback-state`
    window.location.href = url
  }
</script>

<button type="button" on:click={authorize}>LOG IN</button>
