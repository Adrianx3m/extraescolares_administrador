const usuariosController = require("../controllers/usuarios");
const clubesController = require("../controllers/clubes");
const generacionController = require("../controllers/generaciones");
const gruposController = require("../controllers/grupos");
const alumnosController = require("../controllers/alumnos");
const a_clubesController = require("../controllers/a_clubes");
const a_homenajesController = require("../controllers/a_homenajes");
const documentosController = require("../controllers/documentos");
const vt = require("../controllers/verifytokens");

module.exports = (app) => {

/* ruta libre para poder iniciar sesión */
app.post('/api/v1/login',usuariosController.logear)

/* rutas de acceso a la tabla usuarios  */
app.get("/api/v1/usuarios/list",vt.verifyTokenAdmin,usuariosController.listar)
app.post("/api/v1/usuarios/create",vt.verifyTokenAdmin,usuariosController.crear)
app.put("/api/v1/usuarios/update",vt.verifyTokenAdmin,usuariosController.actualizar)
app.delete("/api/v1/usuarios/delete",vt.verifyTokenAdmin,usuariosController.borrar)

/* ruta de acceso a la tabla de Asistencia a clubes */
app.post("/api/v1/asistencia_clubes/list",vt.verifyToken,a_clubesController.listar)
app.put("/api/v1/asistencia_clubes/update",vt.verifyToken,a_clubesController.actualizar)
app.get("/api/v1/asistencia_clubes/estadistica",vt.verifyTokenAdmin,a_clubesController.estadistica)
app.get("/api/v1/asistencia_clubes/mayor",vt.verifyTokenAdmin,a_clubesController.mejor)
app.get("/api/v1/asistencia_clubes/menor",vt.verifyTokenAdmin,a_clubesController.peor)
app.get("/api/v1/asistencia_clubes/cultural",vt.verifyTokenAdmin,a_clubesController.cultural)
app.get("/api/v1/asistencia_clubes/deportivo",vt.verifyTokenAdmin,a_clubesController.deportivo)
app.get("/api/v1/asistencia_clubes/alumno_problema",vt.verifyTokenAdmin,a_clubesController.problema)

/** ruta de acceso a la tabla de Asistencia a homenajes */
app.post("/api/v1/asistencia_homenajes/list",vt.verifyTokenGrupo,a_homenajesController.listar)
app.put("/api/v1/asistencia_homenajes/update",vt.verifyTokenGrupo,a_homenajesController.actualizar)
app.get("/api/v1/asistencia_homenajes/estadistica",vt.verifyTokenAdmin,a_homenajesController.estadistica)
app.get("/api/v1/asistencia_homenajes/mayor",vt.verifyTokenAdmin,a_homenajesController.mejor)
app.get("/api/v1/asistencia_homenajes/alumno_problema",vt.verifyTokenAdmin,a_homenajesController.problema)

/* rutas de acceso a la tabla clubes */
app.get("/api/v1/clubes/list",vt.verifyTokenAdmin,clubesController.listar) 
app.post("/api/v1/clubes/create",vt.verifyTokenAdmin,clubesController.crear) 
app.put("/api/v1/clubes/update",vt.verifyTokenAdmin,clubesController.actualizar) 
app.delete("/api/v1/clubes/delete",vt.verifyTokenAdmin,clubesController.borrar) 

/* rutas de acceso a la tabla generaciones */
app.get("/api/v1/generacion/list",vt.verifyTokenAdmin,generacionController.listar)
app.post("/api/v1/generacion/create",vt.verifyTokenAdmin,generacionController.crear) 
app.put("/api/v1/generacion/update",vt.verifyTokenAdmin,generacionController.actualizar)
app.delete("/api/v1/generacion/delete",vt.verifyTokenAdmin,generacionController.borrar) 

/* rutas de acceso a la tabla grupos */
app.get("/api/v1/grupos/list",vt.verifyTokenAdmin,gruposController.listar)
app.post("/api/v1/grupos/create",vt.verifyTokenAdmin,gruposController.crear)
app.put("/api/v1/grupos/update",vt.verifyTokenAdmin,gruposController.actualizar)
app.delete("/api/v1/grupos/delete",vt.verifyTokenAdmin,gruposController.borrar)
app.post("/api/v1/grupos/asesor",vt.verifyTokenAdmin,gruposController.cambioAsesor)

/* rutas de acceso a la tabla alumnos */
app.get("/api/v1/alumnos/list",vt.verifyTokenAdmin,alumnosController.listar)
app.get("/api/v1/alumnos/list/nombre/:nombre",vt.verifyTokenAdmin,alumnosController.listarNombre)
app.get("/api/v1/alumnos/list/paterno/:paterno",vt.verifyTokenAdmin,alumnosController.listarPaterno)
app.get("/api/v1/alumnos/list/materno/:materno",vt.verifyTokenAdmin,alumnosController.listarMaterno)
app.get("/api/v1/alumnos/list/club/:club",vt.verifyTokenAdmin,alumnosController.listarClub)
app.get("/api/v1/alumnos/list/generacion/:generacion",vt.verifyTokenAdmin,alumnosController.listarGeneracion)
app.get("/api/v1/alumnos/list/grupo/:grupo",vt.verifyTokenAdmin,alumnosController.listarGrupo)
app.get("/api/v1/alumnos/list/sexo/:sexo",vt.verifyTokenAdmin,alumnosController.listarSexo)
app.post("/api/v1/alumnos/create",vt.verifyTokenAdmin,alumnosController.crear)
app.put("/api/v1/alumnos/update",vt.verifyTokenAdmin,alumnosController.actualizar)
app.delete("/api/v1/alumnos/delete",vt.verifyTokenAdmin,alumnosController.borrar)
app.get("/api/v1/alumnos/sexo",vt.verifyTokenAdmin,gruposController.listarSexos)

/** rutas de acceso documentos */
app.get("/api/v1/documentos/excel_club",/*vt.verifyTokenAdmin,*/documentosController.auxiliarExcel)
app.get("/api/v1/documentos/excel_grupo",/*vt.verifyTokenAdmin,*/documentosController.auxiliarExcelGrupos)

app.get("/123",(_,res)=>{
    res.json({usuario:"admin",'contraseña':"Extra Escolares"});
})

}