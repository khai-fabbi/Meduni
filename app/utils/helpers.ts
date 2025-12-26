export const goToTop = () => window.scrollTo(0, 0)
export function isEmpty(obj: Array<unknown> | object): boolean {
  if (!obj || typeof obj !== 'object') return !obj

  if (Array.isArray(obj)) {
    return !obj.length
  }

  return !Object.keys(obj).length
}
export function removeUndefinedAndNull(obj: object) {
  const result: Record<string, unknown> = {}

  for (const key in obj) {
    if (
      obj[key as keyof object] !== undefined
      && obj[key as keyof object] !== null
    ) {
      result[key as string] = obj[key as keyof object]
    }
  }

  return result
}

export const getLinkFromS3 = (path: string) => {
  if (!path) return ''
  const config = useRuntimeConfig()
  const appAssetEndpoint = config.public.appAssetEndpoint as string
  return `${appAssetEndpoint}/${path}`
}

export const formatDuration = (seconds: number) => {
  if (!seconds) return '0 phút'

  if (seconds <= 60) {
    if (Math.floor(seconds / 30) > 0) {
      return '1 phút'
    } else {
      return '0 phút'
    }
  }

  const hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds % 3600) / 60)
  const secondsLeft = seconds - minutes * 60 - hours * 3600
  if (secondsLeft >= 30) {
    minutes = minutes + 1
  }

  const parts = []

  if (hours > 0) {
    parts.push(`${hours} tiếng `)
  }

  if (minutes > 0) {
    parts.push(`${minutes} phút `)
  }

  return parts.join('')
}
