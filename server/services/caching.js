let cache = {}
const ttl = 1000 * 60 * 25 // 25 minutes

function setCache(key, value) {
  cache[key] = {
    value: value,
    timestamp: Date.now(),
  }
}

function getCache(key) {
  const cachedItem = cache[key]
  if (cachedItem) {
    // Check if cache is still valid
    if (Date.now() - cachedItem.timestamp < ttl) {
      return cachedItem.value
    } else {
      // Cache expired, remove it
      delete cache[key]
    }
  }
  return null
}

const deleteCache = (key) => {
  if (delete cache[key]) return true
}

const flush = () => {
  cache = {}
}

export { setCache, getCache, deleteCache, flush }
