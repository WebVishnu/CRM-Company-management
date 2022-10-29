async function sendToken(user, statusCode, res) {
  const token = user.getJWTtoken()
  uID = user._id
  const options = {
    token,
    uID
  }
  res.cookie("token", options, { maxAge: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000), httpOnly: true })
  res.redirect('/')
}

async function sendTokenAdmin(admin, statusCode, res) {
  const token = admin.getJWTtoken()
  uID = admin._id
  const options = {
    token,
    uID,
    role: admin.role
  }
  res.cookie("adminToken", options, { maxAge: new Date(Date.now() + process.env.ADMIN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), httpOnly: true })
  res.redirect('/vitco-india/control')
}
module.exports = { sendToken, sendTokenAdmin }