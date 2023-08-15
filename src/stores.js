import { writable } from 'svelte/store'

export const CURRENT_ITEM = writable('')
export const CURRENT_TRACK = writable(null)
export const CURRENT_STATUS = writable(null)
export const DEVICE_ID = writable(null)

export const CURRENT_VOLUME = writable(0.3)
export const VOLUME__MUTE = writable(false)
