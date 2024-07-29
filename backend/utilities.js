
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  
  // Obtener el encabezado de autorización
  const authHeader = req.headers['authorization'];
  
  // Extraer el token del encabezado
  const token = authHeader && authHeader.split(" ")[1];

  // Si no hay token, devolver estado 401 (No autorizado)
  if (!token) return res.sendStatus(401);

  // Verificar el token usando el secreto de acceso
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
    // Si hay un error en la verificación, devolver estado 401 (No autorizado)
    if (err) return res.sendStatus(401);
    
    // Si el token es válido, guardar el usuario en la solicitud
    req.user = user;
    
    // Continuar con el siguiente middleware
    next();
  });
}

module.exports = {
  authenticateToken,
};
