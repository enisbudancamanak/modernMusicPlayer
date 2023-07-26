import { writable } from 'svelte/store'

export const CLIENT_ID = writable('a9b237e54c0245588bd2f0f2146f12a8')
export const CLIENT_SECRET = writable('ff89424b29b4442fa4138b8ae6dbcca4')
export const LOGGED_IN = writable(false)
export const CURRENT_ITEM = writable('DISCOVER')
