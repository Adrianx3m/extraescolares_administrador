const connection = require("../conexion");
module.exports={
    listar(_,res){
        connection.query("SELECT `id`, `Nombre`, `id_tipo_club` AS tipo FROM `clubs` WHERE `id_tipo_club`!=3",[],
    function(err,results,fields){
        res.json(results);
    })
    },
    crear(req,res){
        connection.query("INSERT INTO clubs(`Nombre`,`id_tipo_club`) VALUES(?,?)",[req.body.nombre,req.body.tipo],
        function(error,results){
            if(error){
                res.json({ message: error });
            }else{
               res.json({message:"Datos guardados"})
            }
        })
    },
    actualizar(req,res){
        connection.query(
            "UPDATE `clubs` SET `Nombre` = ?, `id_tipo_club` = ? WHERE `clubs`.`id` = ?",
            [req.body.nombre,req.body.id_tipo,req.body.id],
            function(error,results){
                if(error){
                     res.json({message:error})
                }else{
                    res.json({message:"Datos Actualizados"})
                }
            }
        )
    },
    borrar(req,res){
        connection.query(
            "DELETE FROM `clubs` WHERE id=?",
            [req.body.id],
            function(error,results){
                if(error){
                    return res.json({message:error})
                }else{
                    return res.json({message:"Dato borrado"})
                }
            }
        )
    }
}