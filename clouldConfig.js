const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({//es file se cloud ko contact krne ya connect krne ka kaam krr rhe hai
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_KEY_SECRET
})

const storage = new CloudinaryStorage({//cloud se connect krne ke baad usme kha pr kya store krna hai
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_dev',//in cloud we made folder jiska name ye hai
    allowedFormat: ["png","jpg","jpeg"] //folder jo ki es es type ki information store kr skta hai
  },
});

module.exports={cloudinary,storage};