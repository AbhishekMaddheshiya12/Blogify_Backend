import { Blog } from "../models/blog.js";
import { Comment } from "../models/comment.js";
import { Like } from "../models/like.js";
import { User } from "../models/user.js";
import { uploadFile } from "../utils/uploadfile.js";

const uploadBlog = async (req, res) => {
  try {
    const { title, subtitle, content,category} = req.body;
    const {_id} = req.user;
    const file = req.file;
    if (!title || !subtitle || !content) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const result = await uploadFile([file]);
    const selectedImage = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    const blog = await Blog.create({
      title,
      subtitle,
      content,
      category,
      selectedImage,
      creator: _id,
    });

    return res.status(200).json({
      success: true,
      message: "Blog uploaded successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "There is some error in uploading the blog, please try again",
    });
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const { category } = req.params;
    const blogs = await Blog.find(category ?{category}:{});
    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "There is some error in fetching the data",
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide blog id",
      });
    }

    const blog = await Blog.findById(_id).populate("creator");
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "There is some error in fetching the data",
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const { _id } = req.user; // Get the user ID from request parameters
    const {bio, username, email, address, socialId } = req.body; // Extract fields from request body
    console.log(_id);
    // Validate userId
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid user ID.",
      });
    }

    // Update the user's profile
    // const updatedUser = await User.findByIdAndUpdate(
    //   userId,
    //   {
    //     $set: {
    //       email,    // Update email
    //       Address,  // Update address
    //       "socialId.linkedin": socialId?.linkedin, // Update LinkedIn if provided
    //       "socialId.GitHub": socialId?.github,     // Update GitHub if provided
    //       "socialId.twitter": socialId?.twitter, // Update Twitter/Instagram if provided
    //     },
    //   },
    //   { new: true, runValidators: true } // Return updated document and validate schema
    // );

    const updatedData = {};
    if(username)updatedData.username = username;
    if(email)updatedData.email = email;
    if(address)updatedData.Address = address;
    if(socialId?.linkedin)updatedData["socialId.linkedin"] = socialId.linkedin;
    if(socialId?.github)updatedData["socialId.github"] = socialId.github;
    if(socialId?.twitter)updatedData["socialId.twitter"] = socialId.twitter;
    if(bio)updatedData.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(_id,{$set:updatedData}, { new: true, runValidators: true });

    // Check if the user exists
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Respond with the updated user
    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile.",
    });
  }
};

const getBlogsByUser = async (req, res) => {
  try {
    const { _id } = req.user;
    if(!_id){
      return res.status(400).json({
        success: false,
        message: "Please provide User id",
      })
    }
    const blogs = await Blog.find({ creator: _id }).populate("creator");

    if(!blogs){
      return res.status(404).json({
        success: false,
        message: "Blogs not found",
      })
    }
  
    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "There is some error in fetching the data",
    });
  }
};


const addLikes = async(req,res) => {
  try{
    const {blogId} = req.params;
    const {_id} = req.user;

    if(!blogId){
      return res.status(400).json({
        success: false,
        message: "Please provide blog id",
      });
    }

    if(!_id){
      return res.status(400).json({
        success: false,
        message: "Please provide user id",
      });
    }

    // check whether the user has already liked the blog or not

    const isLiked = await Like.findOne({ blog: blogId, user: _id });

    if (isLiked) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this blog",
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const like = await Like.create({
      blog: blogId,
      user: _id,
    });

    await Blog.findByIdAndUpdate(blogId, { $push: { likes: like._id } });

    return res.status(200).json({
      success: true,
      message: "Blog liked successfully",
      like,
    });
    
  }catch(error){
    console.log(error);
    res.status(404).json({
      success: false,
      message: "There is some error in liking the blog",
    })
  }
}

const getLikes = async(req,res) => {
    const {blogId} = req.params;
    if(!blogId){
      return res.status(400).json({
        success: false,
        message: "Please provide blog id",
      });
    }

    const likes = await Like.find({ blog: blogId });

    res.status(200).json({
      success: true,
      message: "Likes fetched successfully",
      likes,
    });
}

const addComment = async(req,res) => {
  try{
    const {blogId} = req.params;
    const {_id} = req.user;
    const {comment} = req.body;

    if(!blogId || !_id){
      return res.status(400).json({
        success: false,
        message: "Please provide blog id or _id",
      })
    }

    const newComment = await Comment.create({
      blog: blogId,
      user: _id,
      comment: comment,
    });

    await Blog.findByIdAndUpdate(blogId,{$push:{comments:newComment._id}});

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      newComment,
    })

  }catch(error){
    console.log(error);
    res.status(404).json({
      success: false,
      message: "There is some error in adding comment",
    })
  }
}

const getComment = async(req,res) => {
  try{
    const {blogId} = req.params;
    if(!blogId){
      return res.status(400).json({
        success: false,
        message: "Please provide blog id",
      });
    }

    const comments = await Comment.find({blog:blogId}).populate("user");

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments
    });

  }catch(error){
    console.log(error);
    res.status(404).json({
      success: false,
      message: "There is some error in fetching comments",
    })
  }
}

const updateBlogs = async(req,res,next) => {
  try{
    const {blogId} = req.params;
    const changerId = req.user._id;
    const creator = await Blog.findById({_id:blogId});
    const id = creator?.creator;
    const newId = id.toString();
  
    if(changerId != newId){
      return res.status(400).json({
        success:false,
        message:"You are not authorized to update this blog."
      })
    }

    const {title,subtitle,content} = req.body;

    const updatedData = {};
    if(title)updatedData.title = title;
    if(subtitle)updatedData.subtitle = subtitle;
    if(content)updatedData.content = content;

    const changedData = await Blog.findByIdAndUpdate({_id:blogId},{$set:updatedData}, { new: true, runValidators: true });

    if(!changedData){
      return res.status(400).json({
        status:false,
        message:"Can't update blog"
      })
    }

    res.status(200).json({
      success:true,
      message:"Blog updated successfuly"
    })
   
  }catch(error){
    console.log(error);
    res.status(404).json({
      success:false,
      message:"There is some error in updating the blog."
    })
  }
}

const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const changerId = req.user._id;

    // Find the blog
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    // Check if the logged-in user is the creator of the blog
    const creatorId = blog.creator.toString();
    if (changerId.toString() !== creatorId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this blog.",
      });
    }

    // Delete the blog
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: "Unable to delete the blog. It may have already been deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog successfully deleted.",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the blog.",
    });
  }
};


export { uploadBlog, getAllBlogs, getBlogById ,editProfile,getBlogsByUser,addLikes,getLikes,addComment,getComment,updateBlogs,deleteBlog};
