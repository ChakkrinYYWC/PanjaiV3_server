const   user = require('../model/user');

module.exports = {
    async isLogin(req, res, next){
        console.log("Token: "+req.body.PanjaiToken)
        if (req.body.PanjaiToken === undefined){
            console.log("noLogin")
            res.send("noLogin")
        } else {
            user.find({accessToken: req.body.PanjaiToken}, function(err, found){
                if(err){
                    console.log("not found")
                    console.log(err);
                } else {
                    console.log("pass")
                    res.send("pass")
                }
            })
        }
    }
    // isLoggedin(req, res, next){
    //     if(req.isAuthenticated()){
    //         return next()
    //     }
    //     req.flash('error', 'You need to login first');
    //     res.redirect('/login')
    // },
    // isAdmin(req, res, next){
    //     if(req.isAuthenticated()){
    //         user.findById(res.locals.currentUser._id, function(err, founduser){
    //             if(err){
    //                 //res.redirect("back");
    //                 console.log(err)
    //                 res.redirect('back');
                    
    //             }
    //             if(founduser.permission.toString() == "admin") {

    //                 next();
    //             } else {
    //                 req.flash('error', 'Sorry, only admin can do this!');
    //                 res.redirect('back');
    //             }
    //         });
    //     } else {
    //         req.flash('error', 'You need to login first');
    //         res.redirect('back');
    //     }
    // },
    // checkPostOwnership(req, res, next){
    //     if(req.isAuthenticated()){
    //         post.findById(req.params.id, function(err, foundpost){
    //             if(err){
    //                 //res.redirect("back");
    //                 console.log(err)
    //                 res.redirect('back');
    //             }
    //             if(foundpost.owner_id.toString() == res.locals.currentUser._id) {
    //                 next();
    //             } else {
    //                 req.flash('error', 'You must be owner or admin');
    //                 res.redirect('back');
    //             }
    //         });
    //     } else {
    //         req.flash('error', 'You need to login first');
    //         res.redirect('back');
    //     }
    // },
    // havepermission(req, res, next){
    //     if(req.isAuthenticated()){
    //         user.findById(res.locals.currentUser._id, function(err, founduser){
    //             post.findById(req.params.id, function(err, foundpost){
    //                 if(err){
    //                 //res.redirect("back");
    //                 console.log(err)
    //                 res.redirect('back');
                        
    //                 }
    //                 if(founduser.permission.toString() == "admin") {
    //                     next();
    //                 } else {
    //                     if(foundpost.owner_id.toString() == res.locals.currentUser._id) {
    //                         next();
    //                     } else {
    //                     req.flash('error', 'You must be owner or admin');
    //                     res.redirect('back');
    //                     }
    //                 }
    //             });     
    //         });
    //     } else {
    //         req.flash('error', 'You need to login first');
    //         res.redirect('back');
    //     }
    // },
    
    // checkCommentOwnership(req, res, next){
    //     if(req.isAuthenticated()){
    //         comment.findById(req.params.id, function(err, foundComment){
    //             if(err){
    //                 res.redirect("back");
    //             } else {
    //                 if(foundComment.author.id.equals(req.user._id)) {
    //                     next();
    //                 } else {
    //                     res.redirect('back');
    //                 }
    //             }
    //         });
    //     } else {
    //         res.redirect('back');
    //     }
    // }
}