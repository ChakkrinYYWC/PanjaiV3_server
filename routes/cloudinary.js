const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dfuqgcqif",
    api_key: "836578381329955",
    api_secret: "qeXingjN8-x-r7O50kXwv0j6Nfc",
});

module.exports = cloudinary;


// require('dotenv').config();
// const cloudinary = require('cloudinary').v2;
// cloudinary.config({
//     cloud_name: "dfuqgcqif",
//     api_key: "836578381329955",
//     api_secret: "qeXingjN8-x-r7O50kXwv0j6Nfc",
// });
// // cloudinary.config({
// //     cloud_name: process.env.CLOUDINARY_NAME,
// //     api_key: process.env.CLOUDINARY_API_KEY,
// //     api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// module.exports = { cloudinary };
