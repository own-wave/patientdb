CREATE TABLE sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  display_name VARCHAR(255) NOT NULL
);

CREATE TABLE visit_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  display_name VARCHAR(255) NOT NULL
);

CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  patronymic VARCHAR(255) NOT NULL,
  birthDate DATE,
  source_id INTEGER NOT NULL REFERENCES sources(id),
  phone VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  visit_type_id INTEGER NOT NULL REFERENCES visit_types(id),
  bill DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL
);

