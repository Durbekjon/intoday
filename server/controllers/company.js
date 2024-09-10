import { Company, User, Role } from '../models/Schema.js'
import { createError } from '../utils/error.js'
import { GetCompanyById, GetRole } from '../services/getServices.js'
import { deleteCache, setCache, getCache } from '../services/caching.js'

export const create = async (req, res, next) => {
  try {
    const { name, plan } = req.body

    const company = await new Company({
      name,
      plan,
      author: req.user._id,
    }).save()

    const role = await new Role({
      user: req.user._id,
      type: 'author',
      company: company._id,
    }).save()

    await User.updateOne(
      { _id: req.user._id },
      { $push: { roles: role._id }, selectedRole: role._id }
    )

    deleteCache('user/' + req.user._id)

    return res.status(201).json({
      status: 'OK',
      result: company._id,
    })
  } catch (error) {
    return next(createError(500, error))
  }
}

export const getOne = async (req, res, next) => {
  try {
    const id = req.params.id

    const ICompany = req.role.company.id.toString()

    if (id !== ICompany) return next(createError(403, 'Access denied'))

    const company = await GetCompanyById(id)

    return res.status(200).json(company)
  } catch (error) {
    return next(createError(500, error))
  }
}
export const update = async (req, res, next) => {
  const id = req.params.id

  const ICompany = req.company

  if (id !== ICompany) return next(createError(403, 'Access denied'))

  const company = await GetCompanyById(id)

  if (!company) return r.res(res, 404, { message: 'Company not found' })

  try {
    const { name } = req.body
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    )
    deleteCache('company/' + updatedCompany._id)
    deleteCache('user/' + req.user._id)

    return res.status(200).json({
      message: 'Company was successfully updated',
      data: updatedCompany,
    })
  } catch (error) {
    return next(createError(500, error))
  }
}
export const deleteCompany = async (req, res, next) => {
  const id = req.params.id
  const company = req.company
  const role = req.role
  try {
    const data = await Company.findByIdAndDelete(id)

    if (!data) return next(createError(404, 'Company is not found'))

    deleteCache('company/' + company)
    await Role.deleteMany({ company })

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { roles: role._id }, selectedRole: '' }
    )

    deleteCache('user/' + req.user._id)

    return res.status(200).send({ message: 'Company was deleted' })
  } catch (error) {
    return next(createError(404, error))
  }
}
