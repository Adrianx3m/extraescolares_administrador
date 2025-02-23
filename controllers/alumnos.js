const connection = require("../conexion");

module.exports={
    listar(_,res){
        connection.query("SELECT * FROM alumnos ORDER BY nombre ASC",[],function(error,results){return res.json(results)})
    },
    listarClub(req,res){
        connection.query("SELECT * FROM alumnos WHERE id_club=? ORDER BY nombre ASC",[req.params.club],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
            return res.json(results)
            }
        })
    },
    listarGeneracion(req,res){
        connection.query("SELECT * FROM alumnos WHERE id_generacion=? ORDER BY nombre ASC",[req.params.generacion],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json(results)
            }
        })
    },
    listarGrupo(req,res){
        connection.query("SELECT * FROM alumnos WHERE id_grupo=? ORDER BY nombre ASC",[req.params.grupo],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json(results)
            }
        })
    },
    listarSexo(req,res){
        connection.query("SELECT g.id,CONCAT(g.grado, g.grupo) AS grupo,g.asesor,COUNT(CASE WHEN a.sexo = 'M' THEN 1 END) AS hombres,COUNT(CASE WHEN a.sexo = 'F' THEN 1 END) AS mujeres FROM grupos g LEFT JOIN alumnos a ON g.id = a.id_grupo GROUP BY g.id, g.grado, g.grupo, g.asesor",
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json(results)
            }
        })
    },
    listarNombre(req,res){
        connection.query("SELECT * FROM alumnos WHERE nombre=? ORDER BY nombre ASC",[req.params.nombre],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json(results)
            }
        })
    },
    listarPaterno(req,res){
        connection.query("SELECT * FROM alumnos WHERE a_paterno=? ORDER BY nombre ASC",[req.params.paterno],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json(results)
            }
        })
    },
    listarMaterno(req,res){
        connection.query("SELECT * FROM alumnos WHERE a_materno=? ORDER BY nombre ASC",[req.params.materno],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json(results)
            }
        })
    },
    crear(req,res){
        connection.query("INSERT INTO alumnos(n_control,nombre,a_paterno,a_materno,sexo,id_club,id_generacion,id_grupo) VALUES(?,?,?,?,?,?,?,?)",
        [req.body.control,req.body.nombre,req.body.paterno,req.body.materno,req.body.sexo,req.body.club,req.body.generacion,req.body.grupo],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json({message:"Alumno Agregado"})
            }
        })
    },
    actualizar(req,res){
        connection.query("UPDATE alumnos SET nombre=?,a_paterno=?,a_materno=?,sexo=?,id_club=?,id_generacion=?,id_grupo=? WHERE n_control=?",
        [req.body.nombre,req.body.paterno,req.body.materno,req.body.sexo,req.body.club,req.body.generacion,req.body.grupo,req.body.control],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json({message:"Alumno Actualizado"})
            }
        })
    },
    borrar(req,res){
        connection.query("DELETE FROM alumnos WHERE n_control=?",[req.body.control],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json({message:"Alumno borrado"})
            }
        })
    }
}