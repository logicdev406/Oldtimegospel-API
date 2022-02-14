const router = require('express').Router();
const multer = require('multer');
const {
  listPosts,
  createPost,
  findPostById,
  deletePostById
} = require('../controllers/PostController');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('invalid image type');

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const uploadOptions = multer({ storage: storage });

router.get('/', listPosts);
router.get('/:id', findPostById);
router.post('/', uploadOptions.single('image'), createPost);
router.delete('/:id', deletePostById);

module.exports = router;
