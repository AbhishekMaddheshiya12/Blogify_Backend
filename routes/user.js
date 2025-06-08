import express from 'express';
const router = express.Router();
import { signup ,login, getMyProfile, Logout} from '../controllers/auth.js';
import authMiddleware from '../middleware/auth.js';
import { addComment, addLikes, deleteBlog, editProfile, getAllBlogs, getBlogById, getBlogsByUser, getComment, getLikes, updateBlogs, uploadBlog } from '../controllers/blog.js';
import multer from 'multer';
const storage = multer.memoryStorage();

router.post("/signup",signup)
router.post("/login",login)

router.get("/me",authMiddleware,getMyProfile);
router.post("/uploadblog",authMiddleware,multer({storage,limits:{
    fileSize:1024*1024*10
}}).single("selectedImage"),uploadBlog);

router.get("/getblogs/:category?",getAllBlogs);
router.get("/getblog/:_id",getBlogById);
router.put("/editprofile",authMiddleware,editProfile);
router.get("/getblogsbyUser",authMiddleware,getBlogsByUser);
router.post("/addlikes/:blogId",authMiddleware,addLikes);
router.get("/getlikes/:blogId",authMiddleware,getLikes);
router.post("/addcomment/:blogId",authMiddleware,addComment);
router.get("/getcomment/:blogId",authMiddleware,getComment);
router.get("/logout",authMiddleware,Logout);
router.put("/editblog/:blogId",authMiddleware,updateBlogs);
router.delete("/deleteblog/:blogId",authMiddleware,deleteBlog);

// 6. Why multer.none() Is Necessary
// Even if you're not uploading files, multipart/form-data is processed differently from JSON or URL-encoded data. multer.none() ensures that the multipart/form-data payload is parsed correctly.

// By following these steps, your server will handle form-data properly, and you'll be able to test it successfully using Postman.

export default router;