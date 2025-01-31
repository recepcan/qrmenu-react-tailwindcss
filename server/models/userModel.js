import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isOwner: {
      type: Boolean,
      default: false, // Varsayılan olarak false
    },
  },
  { timestamps: true }
);

// **Kaydetmeden önce `isOwner` alanı eksikse false yap**
userSchema.pre('save', function (next) {
  if (this.isOwner === undefined) {
    this.isOwner = false;
  }
  next();
});

// **Update işlemlerinde de isOwner eksikse ekle**
userSchema.pre('findOneAndUpdate', function (next) {
  if (this._update.isOwner === undefined) {
    this._update.isOwner = false;
  }
  next();
});

userSchema.pre('updateOne', function (next) {
  if (this._update.isOwner === undefined) {
    this._update.isOwner = false;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
