const connection = require('../conexion');
module.exports={
    listar(req,res){
        connection.query("SELECT ah.id,CONCAT(a.nombre,' ',a.a_paterno,' ',a.a_materno) AS nombre,ah.status FROM a_homenajes AS ah,alumnos a WHERE ah.id_grupo=? AND ah.id_grupo=a.id_grupo AND ah.id_alumno=a.n_control AND fecha=?",
        [req.body.club,`${new Date().getFullYear()}-${new Date().getUTCMonth()+1}-${new Date().getDate()}`],
        function(error,results){
            return res.json(results)
        })
    },
    actualizar(req,res){
        connection.query("UPDATE a_homenajes SET status=? WHERE id=?",
        [req.body.status,req.body.id],
        function(error,results){
            if(error){
                return res.json({message:error})
            }else{
                return res.json({message:"Asistencia guardada"})
            }
        }
        )
    },
    estadistica(req,res){
        const dia = new Date();
        connection.query(
            "SELECT CONCAT(grupos.grado,grupos.grupo) AS Nombre, SUM(if(a_homenajes.status = 'A',1,0)) AS asistencia, SUM(if(a_homenajes.status = 'F',1,0)) AS falta,COUNT(a_homenajes.status) AS total FROM a_homenajes,grupos WHERE grupos.id=a_homenajes.id_grupo AND MONTH(fecha) = ? AND YEAR(fecha) = ? GROUP BY Nombre",
            [dia.getMonth()+1,dia.getFullYear()],
            function(err,results,fields){
                res.json(results)
            }
            )
    },
    mejor(_,res){
        const dia = new Date();
        connection.query("SELECT CONCAT(grupos.grado,grupos.grupo) AS Nombre, SUM(if(a_homenajes.status = 'F',1,0)) / COUNT(a_homenajes.status) * 100 AS falta, SUM(if(a_homenajes.status = 'A',1,0)) / COUNT(a_homenajes.status) * 100 AS asistencia, COUNT(a_homenajes.status) AS total FROM a_homenajes JOIN grupos ON grupos.id = a_homenajes.id_grupo WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? GROUP BY Nombre ORDER BY asistencia DESC",
        [dia.getMonth()+1,dia.getFullYear()],
        function(err,results){
            res.json(results)
        })
    },
    problema(_,res){
        const dia= new Date();
        connection.query("SELECT CONCAT(alumnos.nombre,' ',alumnos.a_paterno,' ',alumnos.a_materno) AS nombre, SUM(if(a_homenajes.status = 'F',1,0)) AS falta,CONCAT(grupos.grado,grupos.grupo) AS club FROM alumnos,a_homenajes,grupos WHERE alumnos.n_control=a_homenajes.id_alumno AND alumnos.id_grupo=grupos.id AND a_homenajes.id_grupo=grupos.id AND MONTH(a_homenajes.fecha)=? AND YEAR(a_homenajes.fecha)=? GROUP BY alumnos.nombre HAVING falta>=5",
        [dia.getMonth()+1,dia.getFullYear()],
        function(err,results){
            res.json(results)
        })
    }
}