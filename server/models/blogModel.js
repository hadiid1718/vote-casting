const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        maxlength: 500
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Voter',
        required: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            default: ''
        }
    }],
    featuredImage: {
        url: String,
        publicId: String
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Voter'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    isWinnerAnnouncement: {
        type: Boolean,
        default: false
    },
    relatedElection: {
        type: Schema.Types.ObjectId,
        ref: 'Election'
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    viewsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for better performance
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ author: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ tags: 1 });

// Virtual for comments
blogSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'blog'
});

// Pre-save middleware to generate excerpt
blogSchema.pre('save', function(next) {
    if (this.content && !this.excerpt) {
        // Remove HTML tags and create excerpt
        const plainText = this.content.replace(/<[^>]*>/g, '');
        this.excerpt = plainText.substring(0, 300) + (plainText.length > 300 ? '...' : '');
    }
    next();
});

module.exports = model('Blog', blogSchema);
