var ALL_VISITS_SQL = 'SELECT v.id, v.patient_id AS patientId, v.visit_type_id AS visitTypeId, v.bill, v.date, vt.display_name AS visitType FROM visits v JOIN visit_types vt ON v.visit_type_id = vt.id';
var ALL_PATIENTS_SQL = 'SELECT p.id, p.name, p.surname, p.patronymic, p.birthDate, p.source_id AS sourceId, p.phone, p.email, s.display_name AS source FROM patients p JOIN sources s ON p.source_id = s.id';
var ALL_SOURCES_SQL = 'SELECT id, display_name AS displayName FROM sources';
var ALL_VISIT_TYPES_SQL = 'SELECT id, display_name AS displayName FROM visit_types';

var express = require('express'),
  app = express(),
  sqlite3 = require('sqlite3').verbose(),
  _ = require('underscore'),
  db = new sqlite3.Database('patients.db')
  PORT = process.env.npm_package_port || 8082;

// Returns 'node_modules' folder content on '/node_modules/*' GET requests
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Returns 'public' folder content on '/public/*' GET requests
app.use('/assets', express.static(__dirname + '/assets'));

// Response with index.html on GET /bench-ui request
app.get('/patientDB', function (req, res) {
  res.sendfile("index.html");
});


// Sets 'PORT' variable value as a port for application and add handler for any errors
app.listen(PORT, console.info('Server is started on ' + PORT))
  .on('error', console.error);


// ROUTER
app.get('/rest/patients', getAllPatients);
app.get('/rest/patients/:id', getPatientById);
app.get('/rest/patients/:id/visits', getPatientVisits);

app.get('/rest/visits', getAllVisits);
app.get('/rest/visits/:id', getVisitById);

app.get('/rest/sources', getAllSources);
app.get('/rest/visitTypes', getAllVisitTypes);


// PATIENTS controller
function getAllPatients(req, res) {
  db.all(ALL_PATIENTS_SQL, function(err, rows) {
    if(req.query.sourceId) {
      sources = _.map(req.query.sourceId.split(','), function (sId) {return parseInt(sId, 10);});
      console.log(sources);
      rows = _.filter(rows, function (row) {return _.contains(sources, row.source_id)});
    }
    returnWithChecking(res, err, rows);
  });
}
function getPatientById(req, res) {
  var patientId = req.params.id;
  db.all(ALL_PATIENTS_SQL + ' WHERE p.id = ' + patientId, function(err, rows) {
    returnWithChecking(res, err, rows);
  });
}
function getPatientVisits(req, res) {
  var patientId = req.params.id;
  db.all(ALL_VISITS_SQL + ' WHERE v.patient_id = ' + patientId, function(err, rows) {
    returnWithChecking(res, err, rows);
  });
}


// VISITS controller
function getAllVisits(req, res) {
  db.all(ALL_VISITS_SQL, function(err, rows) {
    returnWithChecking(res, err, rows);
  });
}
function getVisitById(req, res) {
  var visitId = req.params.id;
  db.all(ALL_VISITS_SQL + ' WHERE v.id = ' + visitId, function(err, rows) {
    returnWithChecking(res, err, rows);
  });
}


// SUGGEST controller
function getAllSources(req, res) {
  db.all(ALL_SOURCES_SQL, function(err, rows) {
    returnWithChecking(res, err, rows);
  });
}
function getAllVisitTypes(req, res) {
    db.all(ALL_VISIT_TYPES_SQL, function(err, rows) {
      returnWithChecking(res, err, rows);
  });
}

// UTIL
function returnWithChecking(res, err, rows) {
  if (err == null) {
    res.json(rows);
  } else {
    res.status(500);
  }
}
