const connection = require("../conexion");

module.exports={
    listar(_,res){
        connection.query("SELECT id,grado,grupo,id_carrera AS carrera FROM grupos ORDER BY grado,grupo ASC",[],
        function(error,results){
            return res.json(results)
        })
    },
    crear(req,res){
        connection.query("INSERT INTO grupos(grado,grupo,id_carrera) VALUES(?,?,?)",
        [req.body.grado,req.body.grupo,req.body.carrera],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json({message:"Grupo Agregado"})
            }
        })
    },
    actualizar(req,res){
        connection.query("UPDATE grupos SET grado=?,grupo=?,id_carrera=? WHERE id=?",
        [req.body.grado,req.body.grupo,req.body.carrera,req.body.id],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json({message:"Grupo Actualizado"})
            }
        }
        )
    },
    borrar(req,res){
        connection.query("DELETE FROM grupos WHERE id=?",
        [req.body.id],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json({message:"Grupo borrado"})
            }
        }
        )
    },
    cambioAsesor(req,res){
        connection.query("UPDATE grupos SET asesor=? WHERE id=?",
        [req.body.asesor,req.body.id],
        function(err,results){
            if(err){
                return res.json({message:"No se pudo actualizar el asesor"})
            }else{
                return res.json({message:"Asesor actualizado"})
            }
        })
    },
    listarSexos(_,res){
        connection.query("SELECT g.id, CONCAT(g.grado,g.grupo) AS grupo, g.asesor, COALESCE(SUM(CASE WHEN a.sexo = 'H' THEN 1 ELSE 0 END),0) AS hombres, COALESCE(SUM(CASE WHEN a.sexo = 'M' THEN 1 ELSE 0 END),0) AS mujeres FROM grupos g LEFT JOIN alumnos a ON a.id_grupo=g.id GROUP BY g.id, grupo, g.asesor",
        [],function(err,results){
           return res.json(results)
        })

    }
}