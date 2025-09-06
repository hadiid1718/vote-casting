const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Voter',
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Voter'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    pinnedAt: {
        type: Date
    },
    pinnedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Voter'
    }
}, {
    timestamps: true
});

// Indexes for better performance
commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

// Update blog comment count after saving comment
commentSchema.post('save', async function() {
    const Blog = require('./blogModel');
    const commentCount = await this.constructor.countDocuments({ blog: this.blog });
    await Blog.findByIdAndUpdate(this.blog, { commentsCount: commentCount });
});

// Update blog comment count after removing comment
commentSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        const Blog = require('./blogModel');
        const commentCount = await doc.constructor.countDocuments({ blog: doc.blog });
        await Blog.findByIdAndUpdate(doc.blog, { commentsCount: commentCount });
    }
});

module.exports = model('Comment', commentSchema);
