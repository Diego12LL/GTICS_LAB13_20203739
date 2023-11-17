const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 8000;

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bicicentro'
});

conn.connect(function(err){
    if(err) throw err;
    console.log("Conexión exitosa a base de datos");
});

//listarTrabajadores
app.get("/trabajadores", function (req, res) {
    conn.query("SELECT * FROM trabajadores", function (err, results) {
        if (err) {
            console.error('Error al ejecutar la consulta: ' + err.message);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.json(results);
    });
});

//buscar por id
app.get("/trabajadores/:dni", function (req, res) {
    let dni = req.params.dni;
    console.log(dni);

    conn.query("SELECT * FROM trabajadores WHERE dni = ?", [dni], function (err, results) {
        if (err) throw err;
            res.json(results);
    });
});


app.get("/trabajadores/ventas/:dni", function (req, res) {
    let dni = req.params.dni;
    console.log(dni);

    conn.query("SELECT v.fecha, i.nombre, i.numeroserie,m.nombre FROM ventas v\n" +
        "inner join inventario i on i.idinventario = v.id_inventario\n" +
        "inner join marcas m on m.idmarca = i.idmarca\n" +
        "inner join trabajadores t on v.dniTrabajador = t.dni \n" +
        "where dni = ?;", [dni], function (err, results) {
        if (err) throw err;
        res.json(results);
    });
});


//listarSedes
app.get("/sedes", function (req, res) {
    conn.query("SELECT * FROM sedes", function (err, results) {
        if (err) {
            console.error('Error al ejecutar la consulta: ' + err.message);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.json(results);
    });
});


app.get("/sedes/trabajadores/:idsede", function (req, res) {
    let idsede = req.params.idsede;
    console.log(idsede);

    conn.query("SELECT * FROM bicicentro.trabajadores where idsede =?;", [idsede], function (err, results) {
        if (err) throw err;
        res.json(results);
    });
});







app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


