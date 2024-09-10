import { Company, Member, Notification, User } from '../models/Schema.js'
import { createError } from '../utils/error.js'
import { GetRole } from '../services/getServices.js'
import { privateCheck, privateCreate, privateDelete } from './role.js'
import { setCache, getCache, deleteCache } from '../services/caching.js'
import { checkPlan } from '../middleware/plan.js'

export const invite = async (req, res, next) => {
  try {
    const company = req.company

    const { user, type, permissions, view, workspaces } = req.body

    const plan = await checkPlan(type, company)
    if (plan) {
      return res
        .status(400)
        .json({ message: 'You have reached the limit of your chosen plan!' })
    }

    const member = new Member({
      user,
      type,
      company: req.company,
      permissions,
      view,
      workspaces,
    })

    const text = 'Request an invitation to Workspaces'

    const notification = new Notification({
      from: req.user._id,
      to: user,
      text,
      member: member._id,
      type: 'member',
    })

    member.notification = notification._id

    await member.save()
    await notification.save()
    await User.findByIdAndUpdate(user, {
      $push: { notifications: notification._id },
    })

    await deleteCache('user/' + user)
    const key = `members/company-${req.company}`
    await deleteCache(key)

    return res.status(201).json({
      status: 'OK',
      result: 'An invitation to Workspace has been sent',
    })
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const statusInvite = async (req, res, next) => {
  try {
    const { id, status } = req.body
    const member = await Member.findById(id)

    if (!member) {
      return next(createError(404, 'Member not found'))
    }

    if (String(req.user._id) !== String(member.user)) {
      return next(createError(403, 'Access denied'))
    }

    if (status === 'active') {
      const checkExistRole = await privateCheck(member.user, member.company)

      if (!checkExistRole) {
        await Company.findByIdAndUpdate(member.company, {
          $push: { members: member.id },
        })
        await privateCreate(req.user._id, 'member', member.company, member._id)
      }
    }

    member.status = status
    await member.save()

    const key = `members/company-${member.company}`
    await deleteCache(key)

    return res.status(200).json(member)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const get = async (req, res, next) => {
  try {
    const role = await GetRole(req.user)

    if (!role || String(req.role.company.author) !== String(req.user._id)) {
      return next(createError(403, "You don't have access"))
    }

    const key = `members/company-${req.company}`
    const cache = await getCache(key)

    if (cache) {
      return res.status(200).json(cache)
    }

    const members = await Member.find({
      company: role.company._id,
      status: { $ne: 'rejected' },
    })
      .populate({ path: 'notification', select: 'text type isRead createdAt' })
      .select('-__v')

    await setCache(key, members)
    return res.status(200).json(members)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const cancel = async (req, res, next) => {
  try {
    const id = req.params.id
    const member = await Member.findById(id)

    if (!member) {
      return next(createError(404, 'Not found'))
    }

    if (String(member.company) !== req.company) {
      return next(createError(403, 'Access denied'))
    }

    await privateDelete(member.user, req.company)
    member.status = 'cancelled'

    await member.save()
    await Notification.findByIdAndDelete(member.notification)

    await deleteCache(`members/company-${member.company}`)

    return res.status(200).json(member)
  } catch (error) {
    return next(createError(500, error.message))
  }
}

export const update = async (req, res, next) => {
  try {
    const id = req.params.id
    let member = await Member.findById(id)

    if (!member) {
      return next(createError(404, 'Not found'))
    }

    if (String(member.company) !== req.company) {
      return next(createError(403, 'Access denied'))
    }

    const { type, permissions, view, workspaces } = req.body

    member = await Member.findByIdAndUpdate(
      id,
      { type, permissions, view, workspaces },
      { new: true }
    )

    await deleteCache(`members/company-${member.company}`)
    return res.status(200).json(member)
  } catch (error) {
    return next(createError(500, error.message))
  }
}
