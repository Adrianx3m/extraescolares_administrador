const connection = require("../conexion");

module.exports={
    listar(req,res){
        connection.query("SELECT ac.id,CONCAT(a.nombre,' ',a.a_paterno,' ',a.a_materno) AS nombre,ac.status FROM a_clubes AS ac,alumnos a WHERE ac.id_club=? AND ac.id_club=a.id_club AND ac.id_alumno=a.n_control AND fecha=?",
        [req.body.club,`${new Date().getFullYear()}-${new Date().getUTCMonth()+1}-${new Date().getDate()}`],
        function(error,results){
            return res.json(results)
        })
    },
    actualizar(req,res){
        connection.query("UPDATE a_clubes SET status=? WHERE id=?",
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
            "SELECT clubs.Nombre, SUM(if(a_clubes.status = 'A',1,0)) AS asistencia, SUM(if(a_clubes.status = 'F',1,0)) AS falta,COUNT(a_clubes.status) AS total FROM a_clubes,clubs WHERE clubs.id=a_clubes.id_club AND MONTH(fecha) = ? AND YEAR(fecha) = ? GROUP BY clubs.Nombre",
            [dia.getMonth()+1,dia.getFullYear()],
            function(err,results,fields){
                res.json(results)
            }
            )
    },
    mejor(_,res){
        const dia = new Date();
        connection.query("SELECT clubs.Nombre, SUM(if(a_clubes.status = 'F',1,0)) / COUNT(a_clubes.status) * 100 AS falta, SUM(if(a_clubes.status = 'A',1,0)) / COUNT(a_clubes.status) * 100 AS asistencia, COUNT(a_clubes.status) AS total FROM a_clubes JOIN clubs ON clubs.id = a_clubes.id_club WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? GROUP BY clubs.Nombre ORDER BY asistencia DESC",
        [dia.getMonth()+1,dia.getFullYear()],
        function(err,results){
            res.json(results)
        })
    },
    cultural(_,res){
        const dia = new Date();
        connection.query("SELECT clubs.Nombre, SUM(if(a_clubes.status = 'F',1,0)) / COUNT(a_clubes.status) * 100 AS falta, SUM(if(a_clubes.status = 'A',1,0)) / COUNT(a_clubes.status) * 100 AS asistencia, COUNT(a_clubes.status) AS total FROM a_clubes JOIN clubs ON clubs.id = a_clubes.id_club WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND id_tipo_club=1 GROUP BY clubs.Nombre ORDER BY asistencia DESC",
        [dia.getMonth()+1,dia.getFullYear()],
        function(err,results){
            res.json(results)
        })
    },
    deportivo(_,res){
        const dia = new Date();
        connection.query("SELECT clubs.Nombre, SUM(if(a_clubes.status = 'F',1,0)) / COUNT(a_clubes.status) * 100 AS falta, SUM(if(a_clubes.status = 'A',1,0)) / COUNT(a_clubes.status) * 100 AS asistencia, COUNT(a_clubes.status) AS total FROM a_clubes JOIN clubs ON clubs.id = a_clubes.id_club WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? AND id_tipo_club=2 GROUP BY clubs.Nombre ORDER BY asistencia DESC",
        [dia.getMonth()+1,dia.getFullYear()],
        function(err,results){
            res.json(results)
        })
    },
    peor(_,res){
        const dia = new Date();
        connection.query("SELECT clubs.Nombre, SUM(if(a_clubes.status = 'F',1,0)) / COUNT(a_clubes.status) * 100 AS falta, SUM(if(a_clubes.status = 'A',1,0)) / COUNT(a_clubes.status) * 100 AS asistencia, COUNT(a_clubes.status) AS total FROM a_clubes JOIN clubs ON clubs.id = a_clubes.id_club WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? GROUP BY clubs.Nombre ORDER BY falta DESC LIMIT 1",
        [dia.getMonth()+1,dia.getFullYear()],
        function(err,results){
            res.json(results)
        })

    },
    problema(_,res){
        const dia= new Date();
        connection.query("SELECT CONCAT(alumnos.nombre,' ',alumnos.a_paterno,' ',alumnos.a_materno) AS nombre, SUM(if(a_clubes.status = 'F',1,0)) AS falta,clubs.Nombre AS club FROM alumnos,a_clubes,clubs WHERE alumnos.n_control=a_clubes.id_alumno AND alumnos.id_club=clubs.id AND a_clubes.id_club=clubs.id AND MONTH(a_clubes.fecha)=? AND YEAR(a_clubes.fecha)=? GROUP BY alumnos.nombre HAVING falta>=5",
        [dia.getMonth()+1,dia.getFullYear()],
        function(err,results){
            res.json(results)
        })
    }
}