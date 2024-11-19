// // middleware/isAdmin.js
// module.exports = (req, res, next) => {
//   if (req.session && req.session.isAdmin) {
//     return next(); // Proceed if logged in as admin
//   }
//   res.redirect('/admin/adminlogin'); // Redirect to login if not admin
// };
