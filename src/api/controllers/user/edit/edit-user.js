import { User } from '../../../../models/index.js';
import { validateEditUser } from '../../../validators/user.validator.js';
import { errorHelper, logger, getText, turkishToEnglish } from '../../../../utils/index.js';
import { awsAccessKey, awsSecretAccessKey, awsRegion, bucketName } from '../../../../config/index.js';
import aws from 'aws-sdk';
const { S3 } = aws;

const s3 = new S3({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretAccessKey,
  region: awsRegion,
  signatureVersion: 'v4',
});

export default async (req, res) => {
  const { error } = validateEditUser(req.body);
  
  if (error) {
    console.log(error);
    let code = '00077';
    const message = error.details[0].message;
    if (message.includes('gender'))
      code = '00078';
    else if (message.includes('language'))
      code = '00079';
    else if (message.includes('birthDate'))
      code = '00080';
    else if (message.includes('username'))
      code = '00081';
    return res.status(400).json(errorHelper(code, req, message));
  }

  const user = await User.findById(req.user._id).catch((err) => {
    return res.status(500).json(errorHelper('00082', req, err.message));
  }); 
  
  if(req.body.mobileNo) user.mobileNo = req.body.mobileNo;
  if(req.body.firstName) user.firstName = req.body.firstName;
  if(req.body.lastName) user.lastName = req.body.lastName;
  if(req.body.email) user.email = req.body.email;
  if(req.body.address) user.address = req.body.address; 
  if(req.body.education) user.education = req.body.education;
  if(req.body.photoUrl) user.photoUrl = req.body.photoUrl;

  if (req.body.username && req.body.username !== user.username) {
  const exist = await User.exists({ username: req.body.username }).catch((err) => {
    return res.status(500).json(errorHelper('00083', req, err.message));
  });
  if (exist) return res.status(400).json(errorHelper('00084', req));

  user.username = req.body.username;
  }
  let hasError = false;
  if (req.file) {
  const params = {
    Bucket: bucketName,
    Key: turkishToEnglish(user.name).replace(/\s/g, '').toLowerCase() + '/' + user._id + '/' + Date(Date.now()).toLowerCase().substring(0, 15).replace(/\s/g, '-'),
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  await s3.upload(params).promise().then((data) => {
    user.photoUrl = data.Location;
  }).catch(err => {
    hasError = true;
    return res.status(500).json(errorHelper('00087', req, err.message)).end();
  });
  }

  if (!hasError) {
  await user.save().catch((err) => {
    return res.status(500).json(errorHelper('00085', req, err.message));
  });

  logger('00086', req.user._id, getText('en', '00086'), 'Info', req);
  return res.status(200).json({
    resultMessage: getText('en', '00086'),
    resultCode: '00086',
    photoUrl: user.photoUrl
  });
  }
};
