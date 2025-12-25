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
