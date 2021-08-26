const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        minlength: 5
    },
    location: String,
    avatar: {
        type: String,
        default: null
    },
    subscription: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, opts)

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})
  
// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = function(enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)