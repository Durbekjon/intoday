import { Company, Sheet, Workspace } from '../models/Schema.js'
import { getCache, setCache } from './caching.js'

export function GetRole(user) {
  try {
    return user.roles.filter((r) => r._id == user.selectedRole)[0]
  } catch (error) {
    return null
  }
}

export async function GetCompanyById(id) {
  const key = 'company/' + id
  try {
    // get value from cache
    const cachedValue = getCache(key)
    if (cachedValue) {
      return cachedValue
    } else {
      const company = await Company.findById(id).select('-__v')
      setCache(key, company)
      return company
    }
  } catch (error) {
    return null
  }
}
export async function GetWorkspaceById(id) {
  const key = 'workspace/' + id
  try {
    // get value from cache
    const cachedValue = getCache(key)
    if (cachedValue) {
      return cachedValue
    } else {
      // get workspace from DB
      const workspace = await Workspace.findById(id).select('-__v')
      setCache(key, workspace)
      return workspace
    }
  } catch (error) {
    return null
  }
}
export async function GetSheetById(id) {
  const key = 'sheet/' + id
  try {
    // get value from cache
    const cachedValue = getCache(key)
    if (cachedValue) {
      return cachedValue
    } else {
      // get workspace from DB
      const sheet = await Sheet.findById(id).select('-__v')
      setCache(key, sheet)
      return sheet
    }
  } catch (error) {
    return null
  }
}
