import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import { signout } from '../controllers/userController.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  
  if (!token) {
    // Token yoksa yetkisiz hatası döndürüyoruz
    return next(errorHandler(401, 'Unauthorized - Token Bulunamadı'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Token süresi dolmuşsa kullanıcıyı çıkış yaptır ve /giris-yap sayfasına yönlendir
      if (err.name === 'TokenExpiredError') {
        // Token süresi dolduğunda signOut fonksiyonunu çağır
        signout(req, res, next, true);
        console.log("signedout") // Yönlendirme isteği ile
      } 
      
      // Diğer token hataları için özel bir hata mesajı
      return next(errorHandler(401, 'Bu yetkiye sahip değilsiniz!'));
    }
    
    req.user = user;
    next();
  });
};