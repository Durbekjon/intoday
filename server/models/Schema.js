import { Schema, model, Types } from 'mongoose'
import { SALT_ROUNDS } from '../config/const.config.js'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
  email: { type: String },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  name: String,
  surname: String,
  avatar: {
    type: Types.ObjectId,
    ref: 'File',
  },
  roles: [
    {
      type: Types.ObjectId,
      ref: 'Role',
    },
  ],
  isAdmin: { type: Boolean, default: false },
  selectedRole: { type: String },
  notifications: [{ type: Types.ObjectId, ref: 'Notification' }],
})

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: { type: Types.ObjectId, ref: 'User' },
    members: [{ type: Types.ObjectId, ref: 'Member' }],
    workspaces: [{ type: Types.ObjectId, ref: 'Workspace' }],
    balance: { type: Number, defaut: 0 },
    status: {
      type: String,
      enum: ['active', 'disabled', 'blocked'],
      default: 'active',
    },
    plan: { type: Types.ObjectId, ref: 'Plan' },
    notification: [{ type: Types.ObjectId, ref: 'Notification' }],
  },
  {
    timestamps: true,
  }
)

const memberSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User' },
  type: { type: 'String', enum: ['member', 'viewer'] },
  permissions: [
    { type: String, enum: ['*', 'create', 'read', 'update', 'delete'] },
  ],
  view: { type: String, enum: ['own', 'all'] },
  workspaces: [{ type: Types.ObjectId, ref: 'Workspace' }],
  company: { type: Types.ObjectId, ref: 'Company' },
  status: {
    type: String,
    enum: ['new', 'active', 'rejected', 'cancelled'],
    default: 'new',
  },
  notification: { type: Types.ObjectId, ref: 'Notification' },
})

const planSchema = new Schema({
  name: { type: String },
  price: { type: Number, default: 0 },
  maxWorkspaces: { type: Number },
  maxSheets: { type: Number },
  maxMembers: { type: Number },
  maxViewers: { type: Number },
  order: { type: Number },
})

const columnSchema = new Schema({
  name: { type: String },
  key: { type: String, required: true },
  // selected: { type: Boolean, default: false },
  show: { type: Boolean, default: true },
  type: {
    type: 'String',
    enum: [
      'select',
      'text',
      'number',
      'link',
      'member',
      'date',
      'duedate',
      'file',
      'check',
    ],
  },
  selects: [{ type: Types.ObjectId, ref: 'Select' }],
  selected: String,
  company: { type: Types.ObjectId, ref: 'Company' },
  sheet: { type: Types.ObjectId, ref: 'Sheet' },
})

const sheetSchema = new Schema({
  name: { type: String, default: 'untitled' },
  tasks: [{ type: Types.ObjectId, ref: 'Task' }],
  company: { type: Types.ObjectId, ref: 'Company' },
  workspace: { type: Types.ObjectId, ref: 'Workspace' },
  columns: [{ type: Types.ObjectId, ref: 'Column' }],
})

const taskSchema = new Schema(
  {
    name: { type: String, max: 50 },
    status: { type: String },
    files: { type: Types.ObjectId, ref: 'File' },
    members: [{ type: Types.ObjectId, ref: 'Member' }],
    priority: { type: String },
    // type: { type: String },
    link: { type: String },
    price: { type: Number },
    paid: { type: Boolean },

    sheet: { type: Types.ObjectId, ref: 'Sheet' },
    workspace: { type: Types.ObjectId, ref: 'Workspace' },
    // message: [{ type: Types.ObjectId, ref: "Log" }],
    // type:{type:String, enum:['custom']}
    text1: { type: String },
    text2: { type: String },
    text3: { type: String },
    text4: { type: String },
    text5: { type: String },
    number1: { type: Number },
    number2: { type: Number },
    number3: { type: Number },
    number4: { type: Number },
    number5: { type: Number },
    checkbox1: { type: Boolean },
    checkbox2: { type: Boolean },
    checkbox3: { type: Boolean },
    checkbox4: { type: Boolean },
    checkbox5: { type: Boolean },
    select1: { type: String },
    select2: { type: String },
    select3: { type: String },
    select4: { type: String },
    select5: { type: String },
    date1: { type: Date },
    date2: { type: Date },
    date3: { type: Date },
    date4: { type: Date },
    date5: { type: Date },
  },
  { timestamps: true }
)
const workspaceSchema = new Schema({
  name: { type: String },
  company: { type: Types.ObjectId, ref: 'Company' },
  sheets: [{ type: Types.ObjectId, ref: 'Sheet' }],
  order: { type: Number, default: 50 },
})

const roleSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['author', 'member', 'viewer'] },
  company: { type: Types.ObjectId, ref: 'Company' },
  access: { type: Types.ObjectId, ref: 'Member' },
})

const selectSchema = new Schema({
  value: { type: String, default: 'untitled' },
  color: { type: String },
  company: { type: Types.ObjectId, ref: 'Company' },
})

const notificationSchema = new Schema(
  {
    from: { type: Types.ObjectId, ref: 'User' },
    to: { type: Types.ObjectId, ref: 'User' },
    text: String,
    type: { type: String, enum: ['custom', 'member'] },
    member: { type: Types.ObjectId, ref: 'Member' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const logSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    data: { type: Object },
    task: { type: Types.ObjectId, ref: 'Task' },
    sheet: { type: Types.ObjectId, ref: 'Sheet' },
    workspace: { type: Types.ObjectId, ref: 'Workspace' },
    company: { type: Types.ObjectId, ref: 'Company' },
    type: {
      type: String,
      enum: ['task', 'sheet', 'workspace', 'company'],
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }
    const hashedPassword = await hashPasswordFunction(this.password)
    this.password = hashedPassword
    this.isAdmin = false
    return next()
  } catch (error) {
    return next(error)
  }
})

companySchema.pre('save', async function (next) {
  try {
    this.balance = 0
    return next()
  } catch (error) {
    return next(error)
  }
})

const hashPasswordFunction = async function (password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

const User = model('User', userSchema)
const Company = model('Company', companySchema)
const Member = model('Member', memberSchema)
const Plan = model('Plan', planSchema)
const Sheet = model('Sheet', sheetSchema)
const Task = model('Task', taskSchema)
const Workspace = model('Workspace', workspaceSchema)
const Role = model('Role', roleSchema)
const Notification = model('Notification', notificationSchema)
const Column = model('Column', columnSchema)
const Select = model('Select', selectSchema)
const Log = model('Log', logSchema)
export {
  User,
  Company,
  Member,
  Plan,
  Sheet,
  Task,
  Workspace,
  Role,
  Notification,
  Column,
  Select,
  Log,
}
