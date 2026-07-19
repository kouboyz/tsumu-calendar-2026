import type { MouseEvent } from 'react'

export const isDialogBackdropClick = (
  event: MouseEvent<HTMLDialogElement>,
  dialog: HTMLDialogElement | null,
) => {
  if (!dialog || event.target !== dialog) return false
  const { left, right, top, bottom } = dialog.getBoundingClientRect()
  return (
    event.clientX < left ||
    event.clientX > right ||
    event.clientY < top ||
    event.clientY > bottom
  )
}
