const jwt = require("jsonwebtoken");
const connection = require('../conexion');
const crypto = require('crypto');

function encrypt(plainText, key, outputEncoding = "base64") {
    const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
    return Buffer.concat([cipher.update(plainText), cipher.final()]).toString(outputEncoding);
}

module.exports={
    logear(req,res){
        if(req.body.user.length>3){
        connection.query("SELECT * FROM usuarios WHERE correo=? AND password=?",
        [req.body.user,encrypt(req.body.password,"Extra_Escolares1","base64")],
        function(err, results, fields) {
            if(results.length!=0){
                connection.query(
                    "INSERT INTO `a_clubes`( `id`,`fecha`, `id_alumno`, `id_club`,`id_grupo`) SELECT NULL,?,`n_control`,`id_club`,`id_grupo` FROM `alumnos` WHERE id_club=? AND NOT EXISTS (SELECT fecha,id_alumno,id_club,id_grupo FROM `a_clubes` WHERE `fecha`=? AND id_club=?)",
                    [`${new Date().getFullYear()}-${new Date().getUTCMonth()+1}-${new Date().getDate()}`,results[0].cargo,`${new Date().getFullYear()}-${new Date().getUTCMonth()+1}-${new Date().getDate()}`,results[0].cargo]
                    );
                
                jwt.sign({usuario:results[0].correo,cargo:results[0].cargo,departamento:"ExEs"}, 'secretkey', {expiresIn: '10800s'}, (err, token) => {
                    connection.query("UPDATE usuarios SET token=? WHERE id=?",[token,results[0].id])
                    res.json({
                        token,
                        cargo:results[0].cargo,
                        departamento:"ExEs"
                    });
                })
            }else{
                res.json({message:"Usuario y/o Contraseña incorrecto"})
            }
          }
        )
        }else{
            if(req.body.password==="homenaje"+req.body.user && new Date().getDay() === 1){
                connection.query("SELECT grupos.id, CONCAT(grupos.grado,grupos.grupo) AS semestre FROM  grupos WHERE CONCAT(grupos.grado,grupos.grupo)=?",
                [req.body.user],
                function(err,results){
                    if(results.length!=0){
                        connection.query(
                            "INSERT INTO `a_homenajes`( `id`,`fecha`, `id_alumno`,`id_grupo`) SELECT NULL,?,`n_control`,`id_grupo` FROM `alumnos` WHERE id_grupo=? AND NOT EXISTS (SELECT fecha,id_alumno,id_grupo FROM `a_homenajes` WHERE `fecha`=? AND id_grupo=?)",
                            [`${new Date().getFullYear()}-${new Date().getUTCMonth()+1}-${new Date().getDate()}`,results[0].id,`${new Date().getFullYear()}-${new Date().getUTCMonth()+1}-${new Date().getDate()}`,results[0].id]
                            );
                            jwt.sign({usuario:results[0].semestre,cargo:results[0].id,departamento:"hmj"}, 'secretkey', {expiresIn: '10800s'}, (err, token) => {
                                connection.query("UPDATE grupos SET token=? WHERE id=?",[token,results[0].id])
                                res.json({
                                    token,
                                    cargo:results[0].id,
                                    departamento:"hmj"
                                });
                            })
                    }
                })
            }else if(new Date().getDay() !== 1){
                res.json({message:"Hoy no es Lunes"})
            }else{
                res.json({message:"Usuario y/o Contraseña Incorrecta"})
            }
        }
    },
    listar(_,res){
        connection.query("SELECT u.id, u.correo, u.password,c.Nombre as cargo, u.token FROM usuarios as u,clubs as c WHERE u.cargo=c.id AND u.id!=1",[],function(err,results){
            res.json(results)
        })
    },
    crear(req,res){
        connection.query("INSERT INTO usuarios VALUES(NULL,?,?,?,NULL)",
        [req.body.correo,encrypt(req.body.contrasenia,"Extra_Escolares1","base64"),req.body.cargo],
        function(err,results){
            if(err){
                res.json({message:"No se pudo Crear el usuario"})
            }else{
                res.json({message:"Usuario Creado"})
            }
        })
    },
    actualizar(req,res){
        connection.query("UPDATE usuarios SET correo=?,password=?,cargo=? WHERE id=?",
        [req.body.usuario,encrypt(req.body.password,"Extra_Escolares1","base64"),req.body.cargo,req.body.id],
        function(err,results){
            if(err){
                res.json({message:err})
            }else{
                res.json({message:"Usuario Actualizado"})
            }
        })
    },
    borrar(req,res){
        connection.query("DELETE FROM usuarios WHERE id=?",[req.body.id],
        function(err,result){
            if(err){
                res.json({message:err})
            }else{
                res.json({message:"Usuario Borrado"})
            }
        })
    }

}