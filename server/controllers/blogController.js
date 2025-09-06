const Blog = require('../models/blogModel');
const Comment = require('../models/commentModel');
const Voter = require('../models/voterModel');
const HttpError = require('../models/errorModel');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

// CREATE BLOG - Admin only
const createBlog = async (req, res, next) => {
    try {
        console.log('Creating blog - Request body:', req.body);
        console.log('User ID:', req.user?.id);
        console.log('Files:', req.files);
        
        const { title, content, tags, isWinnerAnnouncement, relatedElection } = req.body;
        
        if (!title || !content) {
            console.log('Missing title or content:', { title, content });
            return next(new HttpError("Title and content are required.", 400));
        }

        console.log('Checking if user is admin...');
        // Check if user is admin
        const user = await Voter.findById(req.user.id);
        console.log('Found user:', user);
        
        if (!user) {
            console.log('User not found!');
            return next(new HttpError("User not found.", 404));
        }
        
        if (!user.isAdmin) {
            console.log('User is not admin!');
            return next(new HttpError("Only admins can create blogs.", 403));
        }

        console.log('Processing featured image...');
        // Handle featured image upload
        let featuredImage = null;
        if (req.files && req.files.featuredImage) {
            console.log('Featured image found:', req.files.featuredImage.name);
            const { featuredImage: imageFile } = req.files;
            
            if (imageFile.size > 2000000) {
                return next(new HttpError("Featured image size should be less than 2MB.", 400));
            }

            console.log('Uploading featured image to Cloudinary...');
            // Upload to Cloudinary
            const uploadResult = await uploadToCloudinary(imageFile, 'blog_featured');
            featuredImage = {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id
            };
            console.log('Featured image uploaded:', uploadResult.secure_url);
        }

        console.log('Parsing tags...');
        // Parse tags if it's a string
        let parsedTags = [];
        if (tags) {
            parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
        }
        console.log('Parsed tags:', parsedTags);

        console.log('Creating blog document...');
        const blogData = {
            title,
            content,
            author: req.user.id,
            tags: parsedTags,
            featuredImage,
            isWinnerAnnouncement: isWinnerAnnouncement === 'true',
            relatedElection: relatedElection || null
        };
        console.log('Blog data:', blogData);
        
        const newBlog = new Blog(blogData);

        console.log('Saving blog...');
        const savedBlog = await newBlog.save();
        console.log('Blog saved:', savedBlog._id);
        
        console.log('Populating blog data...');
        const populatedBlog = await Blog.findById(savedBlog._id)
            .populate('author', 'fullName email isAdmin')
            .populate('relatedElection', 'title');
        console.log('Blog populated successfully');

        res.status(201).json(populatedBlog);
    } catch (error) {
        console.error('Blog creation error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return next(new HttpError(error.message || "Blog creation failed.", 500));
    }
};

// UPLOAD BLOG IMAGES - Admin only
const uploadBlogImages = async (req, res, next) => {
    try {
        console.log('Upload blog images - Files received:', req.files);
        console.log('User ID:', req.user?.id);
        
        if (!req.files || !req.files.images) {
            console.log('No images in request');
            return next(new HttpError("No images provided.", 400));
        }

        console.log('Checking if user is admin...');
        // Check if user is admin
        const user = await Voter.findById(req.user.id);
        console.log('Found user:', user);
        
        if (!user.isAdmin) {
            console.log('User is not admin!');
            return next(new HttpError("Only admins can upload blog images.", 403));
        }

        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
        console.log('Images to process:', images.length);
        
        const uploadedImages = [];

        for (const image of images) {
            console.log('Processing image:', image.name, 'Size:', image.size);
            
            if (image.size > 2000000) {
                console.log('Image too large:', image.name);
                return next(new HttpError(`Image ${image.name} size should be less than 2MB.`, 400));
            }

            console.log('Uploading image to Cloudinary:', image.name);
            const uploadResult = await uploadToCloudinary(image, 'blog_content');
            console.log('Upload result:', uploadResult);
            
            uploadedImages.push({
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                originalName: image.name
            });
        }

        console.log('All images uploaded successfully');
        res.status(200).json({ images: uploadedImages });
    } catch (error) {
        console.error('Image upload error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return next(new HttpError(error.message || "Image upload failed.", 500));
    }
};

// GET ALL BLOGS
const getBlogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, tags, author, search } = req.query;
        
        let query = { status: 'published' };
        
        // Add filters
        if (tags) {
            query.tags = { $in: tags.split(',') };
        }
        if (author) {
            query.author = author;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const blogs = await Blog.find(query)
            .populate('author', 'fullName email isAdmin')
            .populate('relatedElection', 'title')
            .sort({ publishedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Blog.countDocuments(query);

        res.status(200).json({
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        return next(new HttpError("Couldn't fetch blogs.", 500));
    }
};

// GET SINGLE BLOG
const getBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        
        const blog = await Blog.findById(blogId)
            .populate('author', 'fullName email isAdmin')
            .populate('relatedElection', 'title');

        if (!blog) {
            return next(new HttpError("Blog not found.", 404));
        }

        // Increment view count
        blog.viewsCount += 1;
        await blog.save();

        res.status(200).json(blog);
    } catch (error) {
        return next(new HttpError("Couldn't fetch blog.", 500));
    }
};

// UPDATE BLOG - Admin only
const updateBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const { title, content, tags, isWinnerAnnouncement, relatedElection } = req.body;

        // Check if user is admin
        const user = await Voter.findById(req.user.id);
        if (!user.isAdmin) {
            return next(new HttpError("Only admins can update blogs.", 403));
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return next(new HttpError("Blog not found.", 404));
        }

        // Handle featured image update
        let featuredImage = blog.featuredImage;
        if (req.files && req.files.featuredImage) {
            // Delete old image if exists
            if (blog.featuredImage && blog.featuredImage.publicId) {
                await deleteFromCloudinary(blog.featuredImage.publicId);
            }

            const { featuredImage: imageFile } = req.files;
            if (imageFile.size > 2000000) {
                return next(new HttpError("Featured image size should be less than 2MB.", 400));
            }

            const uploadResult = await uploadToCloudinary(imageFile, 'blog_featured');
            featuredImage = {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id
            };
        }

        // Parse tags
        let parsedTags = blog.tags;
        if (tags) {
            parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                title: title || blog.title,
                content: content || blog.content,
                tags: parsedTags,
                featuredImage,
                isWinnerAnnouncement: isWinnerAnnouncement !== undefined ? isWinnerAnnouncement === 'true' : blog.isWinnerAnnouncement,
                relatedElection: relatedElection || blog.relatedElection
            },
            { new: true }
        ).populate('author', 'fullName email isAdmin')
         .populate('relatedElection', 'title');

        res.status(200).json(updatedBlog);
    } catch (error) {
        return next(new HttpError("Blog update failed.", 500));
    }
};

// DELETE BLOG - Admin only
const deleteBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;

        // Check if user is admin
        const user = await Voter.findById(req.user.id);
        if (!user.isAdmin) {
            return next(new HttpError("Only admins can delete blogs.", 403));
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return next(new HttpError("Blog not found.", 404));
        }

        // Delete featured image from Cloudinary
        if (blog.featuredImage && blog.featuredImage.publicId) {
            await deleteFromCloudinary(blog.featuredImage.publicId);
        }

        // Delete all blog images from Cloudinary
        for (const image of blog.images) {
            await deleteFromCloudinary(image.publicId);
        }

        // Delete all comments for this blog
        await Comment.deleteMany({ blog: blogId });

        // Delete the blog
        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({ message: "Blog deleted successfully." });
    } catch (error) {
        return next(new HttpError("Blog deletion failed.", 500));
    }
};

// LIKE/UNLIKE BLOG
const toggleBlogLike = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return next(new HttpError("Blog not found.", 404));
        }

        const likeIndex = blog.likes.indexOf(userId);
        let action = '';

        if (likeIndex === -1) {
            // Like the blog
            blog.likes.push(userId);
            blog.likesCount += 1;
            action = 'liked';
        } else {
            // Unlike the blog
            blog.likes.splice(likeIndex, 1);
            blog.likesCount -= 1;
            action = 'unliked';
        }

        await blog.save();

        res.status(200).json({
            message: `Blog ${action} successfully.`,
            likesCount: blog.likesCount,
            isLiked: action === 'liked'
        });
    } catch (error) {
        return next(new HttpError("Like toggle failed.", 500));
    }
};

// GET BLOG COMMENTS
const getBlogComments = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const { page = 1, limit = 10 } = req.query;

        const comments = await Comment.find({ blog: blogId, parentComment: null })
            .populate('author', 'fullName email isAdmin')
            .populate('pinnedBy', 'fullName email isAdmin')
            .sort({ isPinned: -1, createdAt: -1 }) // Pinned comments first, then by creation date
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Comment.countDocuments({ blog: blogId, parentComment: null });

        res.status(200).json({
            comments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        return next(new HttpError("Couldn't fetch comments.", 500));
    }
};

// CREATE COMMENT
const createComment = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const { content, parentComment } = req.body;

        if (!content) {
            return next(new HttpError("Comment content is required.", 400));
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return next(new HttpError("Blog not found.", 404));
        }

        const newComment = new Comment({
            content,
            author: req.user.id,
            blog: blogId,
            parentComment: parentComment || null
        });

        const savedComment = await newComment.save();
        const populatedComment = await Comment.findById(savedComment._id)
            .populate('author', 'fullName email isAdmin');

        res.status(201).json(populatedComment);
    } catch (error) {
        return next(new HttpError("Comment creation failed.", 500));
    }
};

// UPDATE COMMENT
const updateComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const { content } = req.body;

        if (!content) {
            return next(new HttpError("Comment content is required.", 400));
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new HttpError("Comment not found.", 404));
        }

        // Check if user is the author of the comment
        if (comment.author.toString() !== req.user.id) {
            return next(new HttpError("Unauthorized to update this comment.", 403));
        }

        comment.content = content;
        comment.isEdited = true;
        comment.editedAt = new Date();

        await comment.save();

        const populatedComment = await Comment.findById(commentId)
            .populate('author', 'fullName email isAdmin');

        res.status(200).json(populatedComment);
    } catch (error) {
        return next(new HttpError("Comment update failed.", 500));
    }
};

// DELETE COMMENT
const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new HttpError("Comment not found.", 404));
        }

        // Check if user is the author or admin
        const user = await Voter.findById(req.user.id);
        if (comment.author.toString() !== req.user.id && !user.isAdmin) {
            return next(new HttpError("Unauthorized to delete this comment.", 403));
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        return next(new HttpError("Comment deletion failed.", 500));
    }
};

// TOGGLE COMMENT LIKE
const toggleCommentLike = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return next(new HttpError("Comment not found.", 404));
        }

        const likeIndex = comment.likes.indexOf(userId);
        let action = '';

        if (likeIndex === -1) {
            // Like the comment
            comment.likes.push(userId);
            comment.likesCount += 1;
            action = 'liked';
        } else {
            // Unlike the comment
            comment.likes.splice(likeIndex, 1);
            comment.likesCount -= 1;
            action = 'unliked';
        }

        await comment.save();

        res.status(200).json({
            message: `Comment ${action} successfully.`,
            likesCount: comment.likesCount,
            isLiked: action === 'liked'
        });
    } catch (error) {
        return next(new HttpError("Comment like toggle failed.", 500));
    }
};

// PIN/UNPIN COMMENT - User can pin own comments, Admin can pin any comment
const toggleCommentPin = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id;

        // Get user info
        const user = await Voter.findById(userId);
        if (!user) {
            return next(new HttpError("User not found.", 404));
        }

        const comment = await Comment.findById(commentId)
            .populate('author', 'fullName email isAdmin');
        
        if (!comment) {
            return next(new HttpError("Comment not found.", 404));
        }

        // Check permissions: Admin can pin any comment, user can pin only their own comments
        const canPin = user.isAdmin || comment.author._id.toString() === userId;
        if (!canPin) {
            return next(new HttpError("You can only pin your own comments.", 403));
        }

        // Toggle pin status
        let action = '';
        if (comment.isPinned) {
            // Unpin the comment
            comment.isPinned = false;
            comment.pinnedAt = undefined;
            comment.pinnedBy = undefined;
            action = 'unpinned';
        } else {
            // Pin the comment
            comment.isPinned = true;
            comment.pinnedAt = new Date();
            comment.pinnedBy = userId;
            action = 'pinned';
        }

        await comment.save();

        // Populate the pinnedBy field if the comment is pinned
        const populatedComment = await Comment.findById(commentId)
            .populate('author', 'fullName email isAdmin')
            .populate('pinnedBy', 'fullName email isAdmin');

        res.status(200).json({
            message: `Comment ${action} successfully.`,
            comment: populatedComment,
            isPinned: comment.isPinned
        });
    } catch (error) {
        return next(new HttpError("Comment pin toggle failed.", 500));
    }
};

module.exports = {
    createBlog,
    uploadBlogImages,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    toggleBlogLike,
    getBlogComments,
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    toggleCommentPin
};
