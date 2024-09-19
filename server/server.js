import express from 'express'
import { PORT } from './config/const.config.js'
import connect from './config/db.config.js'
import cors from 'cors'

const app = express()
app.use(express.json())
import path from 'path'
const __dirname = path.resolve()
app.use(express.urlencoded({ extended: false }))
app.use(cors('*'))
//
import auth from './routes/auth.js'
import plan from './routes/plan.js'
import company from './routes/company.js'
import workspace from './routes/workspace.js'
import sheet from './routes/sheet.js'
import member from './routes/member.js'
import notification from './routes/notification.js'
import task from './routes/task.js'
import column from './routes/column.js'
import select from './routes/select.js'
import log from './routes/log.js'
// import file from './routes/file.route.js'
// import settings from './routes/settings.route.js'
// import partners from './routes/partner.route.js'
// import service from './routes/service.route.js'
// import product from './routes/product.route.js'
// import portfolio from './routes/portfolio.route.js'
// import news from './routes/news.route.js'
// import slider from './routes/slider.route.js'
// import banner from './routes/banner.route.js'
// import reception from './routes/reception.route.js'
// import statistics from './routes/statistics.route.js'
// import visit from './routes/visit.route.js'
// import company from "./routes/"

app.use('/api/auth', auth)
app.use('/api/plan', plan)
app.use('/api/company', company)
app.use('/api/workspace', workspace)
app.use('/api/sheet', sheet)
app.use('/api/member', member)
app.use('/api/notification', notification)
app.use('/api/task', task)
app.use('/api/column', column)
app.use('/api/select', select)
app.use('/api/log', log)

// app.use('/api/file', file)
// app.use('/api/settings', settings)
// app.use('/api/partners', partners)
// app.use('/api/service', service)
// app.use('/api/product', product)
// app.use('/api/portfolio', portfolio)
// app.use('/api/news', news)
// app.use('/api/slider', slider)
// app.use('/api/banner', banner)
// app.use('/api/reception', reception)
// app.use('/api/statistics', statistics)
// app.use('/api/visit', visit)

// Render SSR front section start
app.use('/', express.static(path.join(__dirname, 'dist')))

// Render SSR front section start
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || 'Something went wrong!'
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  })
})

app.listen(PORT, () => {
  connect()
  console.log('Server opening on port:' + PORT)
})
