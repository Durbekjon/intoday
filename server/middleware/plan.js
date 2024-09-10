import { Company, Member, Sheet } from '../models/Schema.js'
export const checkPlan = async (model, company) => {
  try {
    const data = await Company.findById(company)
      .populate('plan')
      .select('plan workspaces sheets')

    const plan = data.plan

    switch (model) {
      case 'workspace':
        if (plan.maxWorkspaces <= data.workspaces.length) {
          return true
        } else {
          return false
        }
      case 'sheet':
        const sheetsCount = await Sheet.countDocuments({ company })
        if (plan.maxSheets <= sheetsCount) {
          return true
        } else {
          return false
        }
      case 'member':
        const members = await Member.countDocuments({ company, type: 'member' })
        if (plan.maxMembers <= members) {
          return true
        } else {
          return false
        }
      case 'viewer':
        const viewer = await Member.countDocuments({ company, type: 'viewer' })
        if (plan.maxViewers <= viewer) {
          return true
        } else {
          return false
        }
      default:
        throw new Error('Invalid model type')
    }
  } catch (error) {
    return false
  }
}
