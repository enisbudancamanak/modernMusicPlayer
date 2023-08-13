import { error, redirect } from '@sveltejs/kit'

//Variables
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const redirect_uri = 'http://localhost:5173/'
const token_endpoint = `https://accounts.spotify.com/api/token`

export const GET = async ({ url, cookies }) => {
  try {
    //Fetch call
    const res = await fetch(token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        code: url.searchParams.get('code'),
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      }),
    })

    //If response is ok
    if (res.ok) {
      const data = await res.json()
      console.log(data)

      //Setting cookies
      cookies.set('access_token', data.access_token, {
        secure: true,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60, //1 hour
      })

      //Return data
      return new Response(JSON.stringify(data))
    } else throw error(404, await res.text())
  } catch (err) {
    //Error handling
    console.log('ERROR')
    throw error(err.status, err.body)
  }
}
