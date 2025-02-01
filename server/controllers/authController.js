import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Email adresinin zaten kayıtlı olup olmadığını kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "Email already in use"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    // JWT Token oluşturuluyor ve username bilgisi ekleniyor
    const token = jwt.sign(
      { 
        id: validUser._id, 
        isAdmin: validUser.isAdmin, 
        isOwner: validUser.isOwner,
        username: validUser.username  // Burada username ekleniyor
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" } // Token süresi belirlendi
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Production ortamında secure flag'i aktif
        sameSite: "strict",
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      // Eğer kullanıcı zaten varsa, token'a username ekliyoruz
      const token = jwt.sign(
        { 
          id: user._id, 
          isAdmin: user.isAdmin, 
          isOwner: user.isOwner,
          username: user.username  // Burada username ekleniyor
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .json(rest);
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    // Kullanıcı adı oluşturma, özel karakterleri kaldır
    const cleanUsername = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") // Kullanıcı adındaki özel karakterleri kaldırıyoruz
      .slice(0, 15) + Math.random().toString(9).slice(-4); // Benzersiz hale getirmek için rastgele bir ek ekliyoruz

    const newUser = new User({
      username: cleanUsername,
      email,
      password: hashedPassword,
      profilePicture: googlePhotoUrl,
    });

    await newUser.save();

    // Yeni kullanıcı için token oluşturuluyor, username bilgisi ekleniyor
    const token = jwt.sign(
      { 
        id: newUser._id, 
        isAdmin: newUser.isAdmin, 
        isOwner: newUser.isOwner,
        username: newUser.username  // Burada username ekleniyor
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    const { password, ...rest } = newUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};



// export const authVerify = async (req, res, next) => {
//   try {
//     const token = req.cookies.access_token; // httpOnly cookie'den token al

//     if (!token) {
//       return res.status(401).json({ message: "Yetkilendirme başarısız" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Kullanıcı bilgilerini req objesine ekle
//     next(); // Middleware olduğu için sonraki işlemlere devam et

//   } catch (error) {
//     return res.status(401).json({ message: "Token süresi dolmuş veya geçersiz" });
//   }
// };
