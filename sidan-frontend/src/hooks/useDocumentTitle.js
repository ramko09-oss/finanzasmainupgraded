import { useEffect } from 'react'

export default function useDocumentTitle(title, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const previous = document.title
    document.title = title
    return () => { document.title = previous }
  }, [title, enabled])
}
