import { Role, User } from '../models/Schema.js'
export const privateCreate = async (user, type, company, access) => {
  const role = await new Role({ user, type, company, access })
  await User.findByIdAndUpdate(user, { $push: { roles: role } })
  await role.save()
  return 'success'
}
export const privateDelete = async (user, company) => {
  try {
    const role = await Role.findOneAndDelete({ user, company })
    await User.findByIdAndUpdate(user, { $pull: { roles: role } })
    return 'success'
  } catch (error) {}
}

export const privateCheck = async (user, company) => {
  try {
    const role = await Role.findOne({ user, company })
    return role
  } catch (error) {}
}
