import { sequence } from '@sveltejs/kit/hooks'

async function checkAndSetTokens({ event, resolve }) {
  try {
    const accessToken = await event.cookies.get('access_token')
    // const refreshToken = await event.cookies.get('refresh_token')

    if (event.url.pathname.includes('/player') && !accessToken) {
      return new Response('Redirect', {
        status: 303,
        headers: { Location: '/' },
      })
    }

    if (event.url.pathname === '/' && accessToken) {
      return new Response('Redirect', {
        status: 303,
        headers: { Location: '/player' },
      })
    }

    event.locals.accessToken = accessToken
    // event.locals.refreshToken = refreshToken

    const response = await resolve(event)
    return response
  } catch (err) {
    return new Response('Redirect', {
      status: 303,
      headers: { Location: '/' },
    })
  }
}

export const handle = sequence(checkAndSetTokens)
