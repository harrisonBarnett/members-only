module.exports = {
    ensureAuth: function(req, res, next) {
        if(req.isAuthenticated()) {
            // user has been authenticated, proceed to the route
            return next()
        }
        // user has not been authenticated, redirect
        res.redirect('/users/login')
    },
    forwardAuth: function(req, res, next) {
        if(!req.isAuthenticated()) {
            // user is not authenticated, proceed to the route
            return next()
        }
        // user is authenticated, has no business on this route
        res.redirect('/dashboard')
    }
}