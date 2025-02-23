const jwt = require("jsonwebtoken");
const connection = require("../conexion");
module.exports={
    verifyToken(req, res, next){
        const bearerHeader =  req.headers['authorization'];
     
        if(typeof bearerHeader !== 'undefined'){
             const bearerToken = bearerHeader.split(" ")[1];
             req.token  = bearerToken;
             try{
             jwt.verify(bearerToken,'secretkey',(err,decoded)=>{
                connection.query("SELECT token FROM usuarios WHERE correo=?",
                [decoded.usuario],
                function(err,results,fields){
                    if(results[0].token===bearerToken){
                        next();
                    }else{
                        res.sendStatus(403)
                    }
                }
                )
             })
            }catch(err){
                res.sendStatus(403);
            }
        }else{
            res.sendStatus(403);
        }
     },
    
     verifyTokenAdmin(req, res, next){
        const bearerHeader =  req.headers['authorization'];
     
        if(typeof bearerHeader !== 'undefined'){
             const bearerToken = bearerHeader.split(" ")[1];
             req.token  = bearerToken;
             try{
             jwt.verify(bearerToken,'secretkey',(err,decoded)=>{
                connection.query("SELECT token,cargo FROM usuarios WHERE correo=?",
                [decoded.usuario],
                function(error,results,fields){
                    if(results[0].token===bearerToken && results[0].cargo===13){
                        next();
                    }else if(error){
                        res.sendStatus(403)
                    }
                }
                )
             })
            }catch(err){
                res.sendStatus(403)
            }
        }else{
            res.sendStatus(403);
        }
     },

     verifyTokenGrupo(req, res, next){
        const bearerHeader =  req.headers['authorization'];
     
        if(typeof bearerHeader !== 'undefined'){
             const bearerToken = bearerHeader.split(" ")[1];
             req.token  = bearerToken;
             try{
             jwt.verify(bearerToken,'secretkey',(err,decoded)=>{
                connection.query("SELECT token FROM grupos WHERE CONCAT(grupos.grado,grupos.grupo)=?",
                [decoded.usuario],
                function(err,results,fields){
                    if(results[0].token===bearerToken){
                        next();
                    }else{
                        res.sendStatus(403)
                    }
                }
                )
             })
            }catch(err){
                res.sendStatus(403);
            }
        }else{
            res.sendStatus(403);
        }
     },
}