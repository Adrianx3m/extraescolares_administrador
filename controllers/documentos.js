const connection = require("../conexion")
const excel = require('excel4node')
const XLSXChart = require("xlsx-chart");
const XLSX = require('xlsx');
const fs = require("fs");

function obtenerNombreClub(idClub) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT Nombre FROM clubs WHERE id = ?", [idClub], function (err, results) {
            if (err) {
                return reject(err);
            }
            resolve(results[0].Nombre);
        });
    });
}
function excelGrafica(club) {
    connection.query(
        `SELECT CONCAT(a.nombre, ' ', a.a_paterno, ' ', a.a_materno) AS alumno,
                SUM(IF(ac.status = 'A', 1, 0)) AS asistencias,
                SUM(IF(ac.status = 'F', 1, 0)) AS faltas
         FROM a_clubes AS ac
         JOIN alumnos AS a ON ac.id_alumno = a.n_control
         WHERE ac.id_club = ?
         GROUP BY alumno
         ORDER BY alumno`,
        [club], function (err, results) {
            if (err) {
                console.error(err);
                return;
            }

            if (results.length) {
                let alumnos = results.map((_, index) => `${index + 1}`);
                let asistencias = {};
                let faltas = {};

                results.forEach((curr, index) => {
                    asistencias[`${index + 1}`] = parseInt(curr.asistencias, 10);
                    faltas[`${index + 1}`] = parseInt(curr.faltas, 10);
                });

                var xlsxChart = new XLSXChart();
                var opts = {
                    chart: "column",
                    titles: ["Asistencias", "Faltas"],
                    fields: alumnos,
                    data: {
                        "Asistencias": asistencias,
                        "Faltas": faltas
                    },
                    chartTitle: "Column chart"
                };

                console.log(asistencias, faltas);
                xlsxChart.generate(opts, function (err, data) {
                    if (err) {
                        console.error(err);
                    } else {
                        fs.writeFileSync("column.xlsx", data);
                        console.log("column.xlsx created.");
                    }
                });
            } else {
                console.log("No results found.");
            }
        }
    );
}

module.exports={
    auxiliarExcel(req, res) {
        excelGrafica(req.query.club)
        obtenerNombreClub(req.query.club)
            .then(nombreClub => {
                var wb = new excel.Workbook();
                var bordeRojo = wb.createStyle({
                    font: {
                        bold: false,
                        color: 'ff0000',
                    },
                    border: {
                        bottom: { style: 'thin', color: 'ff0000' },
                        right: { style: 'thin', color: 'ff0000' },
                        left: { style: 'thin', color: 'ff0000' },
                        top: { style: 'thin', color: 'ff0000' }
                    }
                });
    
                var estiloEncabezado = wb.createStyle({
                    font: {
                        bold: true,
                        size: 12
                    },
                    alignment: {
                        horizontal: 'center'
                    }
                });
    
                connection.query("SET @sql1 = NULL;", [], function (err, results) {
                    if (err) {
                        res.json({ message: "Error 1" });
                    } else {
                        connection.query(`
                            SELECT GROUP_CONCAT(DISTINCT CONCAT('MAX(IF(fecha = "', fecha, '", status, NULL)) AS "', fecha, '"')) INTO @sql1
                            FROM a_clubes
                            WHERE id_club = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?`,
                            [req.query.club, parseInt(req.query.mesinicio, 10), req.query.anioinicio], function (err, results) {
                                if (err) {
                                    res.json({ message: "Error 2" });
                                } else {
                                    connection.query(`
                                        SET @sql1 = CONCAT('SELECT CONCAT(a.nombre, " ", a.a_paterno, " ", a.a_materno) AS nombre, CONCAT(g.grado, g.grupo) AS grupo, c.carrera, a.n_control, ', @sql1, ', SUM(IF(ac.status = "A", 1, 0)) AS total FROM a_clubes AS ac JOIN alumnos AS a ON a.n_control = ac.id_alumno JOIN grupos AS g ON a.id_grupo = g.id JOIN carrera AS c ON c.id = g.id_carrera WHERE ac.id_club = ? GROUP BY nombre, grupo, c.carrera, a.n_control');
                                    `, [parseInt(req.query.club)], function (err, results) {
                                        if (err) {
                                            res.json({ message: "Error 3" });
                                        } else {
                                            connection.query(`PREPARE stmt FROM @sql1`, [], function (err, results) {
                                                if (err) {
                                                    res.json({ message: "Error 4" });
                                                } else {
                                                    connection.query(`EXECUTE stmt`, [], function (err, results) {
                                                        if (err) {
                                                            res.json({ message: "Error 5" });
                                                        } else {
                                                            
                                                            var hoja = wb.addWorksheet("Informe de Asistencias");
    
                                                            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                                                            hoja.cell(1, 1, 1, 13, true).string('TECNOLÓGICO NACIONAL DE MÉXICO CAMPUS TECOMATLÁN').style(estiloEncabezado);
                                                            hoja.cell(2, 1, 2, 13, true).string(`INFORME DE ASISTENCIAS DEL CLUB DE ${nombreClub.toUpperCase()}`).style(estiloEncabezado);
                                                            hoja.cell(3, 1, 3, 13, true).string(`${meses[parseInt(req.query.mesinicio, 10) - 1].toUpperCase()} ${req.query.anioinicio}`).style(estiloEncabezado);
                                                            hoja.cell(4, 1, 4, 13, true).string(`INSTRUCTOR: ${nombreClub.toUpperCase()}`).style(estiloEncabezado);
    
                                                            if (results.length) {
                                                                results.forEach((item, i) => {
                                                                    var datas = [];
                                                                    var llaves = Object.keys(item);
                                                                    llaves.forEach(function (llave, index) {
                                                                        datas.push(item[llave])
                                                                        hoja.cell(5, 1).string("No")
                                                                        hoja.cell(5, index + 2).string(llave)
                                                                    })
                                                                    for (var j = 0; j < datas.length; j++) {
                                                                        hoja.cell(5 + (i + 1), 1).number(i + 1)
                                                                        if (datas[j] === null || datas[j] === "F") {
                                                                            hoja.cell(5 + (i + 1), j + 2).string("F").style(bordeRojo)
                                                                        } else {
                                                                            if (typeof datas[j] === "number" || (j + 1) === datas.length) {
                                                                                hoja.cell(5 + (i + 1), j + 2).number(parseInt(datas[j], 10))
                                                                            } else {
                                                                                hoja.cell(5 + (i + 1), j + 2).string(datas[j])
                                                                            }
                                                                        }
    
                                                                    }
                                                                    hoja.cell(5 + (i + 1), (datas.length) + 2).formula(`${excel.getExcelCellRef(5 + (i + 1), datas.length + 1)} * 100 / ${llaves.length - 5}`)
                                                                    hoja.cell(results.length + 6, (datas.length) + 1).formula(`SUM(${excel.getExcelCellRef(6, datas.length + 1)}:${excel.getExcelCellRef(results.length + 5, datas.length + 1)})`)
                                                                    hoja.cell(results.length + 7, (datas.length) + 1).string("Total")
                                                                    hoja.cell(results.length + 7, (datas.length)).formula(`${excel.getExcelCellRef(results.length + 5, 1)} * ${llaves.length - 5}`)
                                                                    hoja.cell(results.length + 7, (datas.length) + 2).formula(`${excel.getExcelCellRef(results.length + 6, (datas.length) + 1)} * 100 / ${excel.getExcelCellRef(results.length + 7, (datas.length))}`)
                                                                })
                                                            }
    
                                                            connection.query("DEALLOCATE PREPARE stmt", [], function (err, results) {
                                                                if (err) {
                                                                    res.json({ message: "Error 6" });
                                                                } else {
                                                                    wb.write('historico_2.xlsx');
                                                                    const wb1 = XLSX.readFile('historico_2.xlsx');
                                                                    const wb2 = XLSX.readFile('column.xlsx');

                                                                    wb2.SheetNames.forEach(sheetName => {
                                                                        const sheet = wb2.Sheets[sheetName];
                                                                        XLSX.utils.book_append_sheet(wb1, sheet, sheetName);
                                                                      });

                                                                      XLSX.writeFile(wb1, 'informe_completo.xlsx');
                                                                      res.download('informe_completo.xlsx')
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                    }
                });
            })
            .catch(err => {
                res.json({ message: "Error obteniendo el nombre del club" });
            });
    },


    auxiliarExcelGrupos(req,res){
        var wb = new excel.Workbook();
        var bordeRojo = wb.createStyle({
            font: {
              bold: false,
              color: 'ff0000',
            },background:{color:'ff0000'},
            border: {
                bottom: {
                  style: 'thin',
                  color: 'ff0000'
                },
                right: {
                  style: 'thin',
                  color: 'ff0000'
                },
                left: {
                  style: 'thin',
                  color: 'ff0000'
                },
                top: {
                  style: 'thin',
                  color: 'ff0000'
                }
              }
          });

        connection.query("SET @sql1 = NULL;",[],function(err,results){
            if(err){
                res.json({message:"Error 1"})
            }else{
                connection.query(`SELECT GROUP_CONCAT(DISTINCT CONCAT('MAX(IF(fecha = "',fecha,'",status,NULL)) AS "',fecha,'"')) INTO @sql1 FROM a_homenajes WHERE id_grupo = ? AND MONTH(fecha) = ? AND YEAR(fecha) = ?`,
                [req.query.club,parseInt(req.query.mesinicio,10),req.query.anioinicio],function(err,results){
                    if(err){
                        res.json({message:"Error 2"})
                    }else{
                        connection.query(`SET @sql1 = CONCAT('SELECT CONCAT(a.nombre," ",a.a_paterno," ",a.a_materno) AS nombre,CONCAT(g.grado,g.grupo) AS grupo, c.carrera, a.n_control, a.sexo, ',@sql1, ', SUM(if(ac.status="A",1,0)) AS total FROM a_homenajes AS ac,alumnos AS a, carrera as c, grupos as g WHERE a.n_control=ac.id_alumno AND c.id=g.id_carrera AND ac.id_grupo=? AND a.id_grupo=g.id GROUP BY nombre')`,
                        [parseInt(req.query.club)],
                        function(err,results){
                            if(err){
                                res.json({message:"Error 3"})
                            }else{
                                connection.query(`PREPARE stmt FROM @sql1`,[],
                                function(err,results){
                                    if(err){
                                        res.json({message:"Error 4"})
                                    }else{
                                        connection.query(`EXECUTE stmt`,[],
                                        function(err,results){
                                            if(err){
                                                res.json({message:"Error 5"})
                                            }else{
                                                var hoja = wb.addWorksheet("Hoja 1");                                                if (results.length) {
                                                    results.forEach((item, i) => {
                                                        var datas = [];
                                                        var llaves = Object.keys(item);
                                                        llaves.forEach(function(llave,index){
                                                            datas.push(item[llave])
                                                            hoja.cell(1,1).string("No")
                                                            hoja.cell(1,index+2).string(llave)
                                                        })
                                                        for(var j =0; j<datas.length; j++){
                                                            hoja.cell(1+(i+1),1).number(i+1)
                                                            //hoja.getExcelCellRef(5, 3);
                                                            if(datas[j]===null || datas[j]==="F"){
                                                                hoja.cell(1+(i+1),j+2).string("F").style(bordeRojo)
                                                            }else{
                                                                if(typeof datas[j] === "number" || (j+1)===datas.length){
                                                                    hoja.cell(1+(i+1),j+2).number(parseInt(datas[j],10))
                                                                }else{
                                                                hoja.cell(1+(i+1),j+2).string(datas[j])
                                                                }
                                                            }
                                                            
                                                        }
                                                        hoja.cell(1+(i+1),(datas.length)+2).formula(`${excel.getExcelCellRef(1+(i+1), datas.length+1)} * 100 / ${llaves.length-5}`)
                                                        hoja.cell(results.length+2,(datas.length)+1).formula(`SUM(${excel.getExcelCellRef(2, datas.length+1)}:${excel.getExcelCellRef(results.length+1, datas.length+1)})`)
                                                        hoja.cell(results.length+3,(datas.length)+1).string("Total")
                                                        hoja.cell(results.length+3,(datas.length)).formula(`${excel.getExcelCellRef(results.length+1, 1)} * ${llaves.length-5}`)
                                                        hoja.cell(results.length+3,(datas.length)+2).formula(`${excel.getExcelCellRef(results.length+2,(datas.length)+1)} * 100 / ${excel.getExcelCellRef(results.length+3,(datas.length))}`)
                                                    })
                                                }
                                                connection.query("DEALLOCATE PREPARE stmt",[],function(err,results){
                                                    if(err){
                                                        res.json({message:"Error 6"})
                                                    }else{
                                                        wb.write('historico_2.xlsx',res); 
                                                        
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },
};

