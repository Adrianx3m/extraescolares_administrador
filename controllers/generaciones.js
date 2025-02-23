const connection = require("../conexion");

module.exports={
    listar(_,res){
        connection.query("SELECT * FROM genaraciones ORDER BY a_inicio ASC",[],function(error,results){
            return res.json(results);
        })
    },
    crear(req,res){
        connection.query("INSERT INTO genaraciones (a_inicio,a_fin) VALUES(?,?)",
        [req.body.inicio,req.body.fin],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json({message:"Generación guardada"})
            }
        }
        )
    },
    actualizar(req,res){
        connection.query(
            "UPDATE genaraciones SET a_inicio=?,a_fin=? WHERE id=?",
            [req.body.inicio,req.body.fin,req.body.id],
            function(error,results){
                if(error){
                    return res.json({message:error})
                }else{
                    return res.json({message:"Generación Actualizada"})
                }
            })
        },
    borrar(req,res){
        connection.query("DELETE FROM genaraciones WHERE id=?",[req.body.id],function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json({message:"Generación Borrada"})
            }
        })
    }
}