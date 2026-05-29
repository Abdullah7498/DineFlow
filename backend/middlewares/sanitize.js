const sanitizeHtml = require('sanitize-html')

const cleanString = value =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {}
  })

const sanitizeValue = value => {
  if (typeof value === 'string') {
    return cleanString(value)
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      value[index] = sanitizeValue(item)
    })
    return value
  }

  Object.keys(value).forEach(key => {
    if (key.includes('$') || key.includes('.')) {
      const sanitizedKey = key.replace(/\$/g, '').replace(/\./g, '')
      value[sanitizedKey] = sanitizeValue(value[key])
      delete value[key]
      return
    }

    value[key] = sanitizeValue(value[key])
  })

  return value
}

const mongoSanitize = (req, res, next) => {
  sanitizeValue(req.body)
  sanitizeValue(req.params)
  sanitizeValue(req.query)
  next()
}

module.exports = mongoSanitize
