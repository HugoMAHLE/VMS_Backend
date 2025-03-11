import {db} from '../database/connection.database.js'
import {edb, sql} from '../database/email.database.js'

const findVisitByCode = async (code) => {
  const query = {
    text: `
    select * from visits
    where code = $1
    `,
    values: [code]
  };
  console.log(code)
  try {
    const { rows } = await db.query(query);
    console.log("find visit by code Query result:", rows); // Check the query result
    if (rows.length === 0) {
      console.log("No visit was found with this code:", code);
      return null;  // Return null or handle as appropriate if no visitor is found
    }
    console.log("Visit found:", rows[0]);
    return rows[0];  // Return the first visitor if found
  } catch (error) {
    console.log("Error executing query:", error);
    return null;  // Handle the error as needed
  }
};

const sendMailConfirmation = async (code, recipient, name, rol) => {
  const query = `
    INSERT INTO Mailing (email, host, code, sent, rol)
    VALUES (@recipient, @name, @code, 0, @rol)
  `;

  try {
    // Obtener la conexión a la base de datos
    const pool = await edb;

    // Crear una solicitud (request) desde la conexión
    const request = pool.request();

    // Asignar los valores a los parámetros
    request.input('recipient', sql.NVarChar, recipient);
    request.input('name', sql.NVarChar, name);
    request.input('code', sql.NVarChar, code);
    request.input('rol', sql.NVarChar, rol)

    // Ejecutar el query
    const result = await request.query(query);

    console.log("Insert result:", result);

    // Verificar si el INSERT fue exitoso
    if (result.rowsAffected[0] > 0) {
      console.log("Email data inserted successfully.");
      return { success: true, message: "Email data inserted successfully." };
    } else {
      console.log("No rows were inserted.");
      return { success: false, message: "No rows were inserted." };
    }
  } catch (error) {
    console.error("Error executing query:", error);
    return { success: false, message: "Error executing query: " + error.message };
  }

};

const findHostById = async (id) => {
  const query = {
    text: `
    select * from users
    where uid = $1
    `,
    values: [id]
  };

  try {
    const { rows } = await db.query(query);
    console.log("find host by id Query result:", rows); // Check the query result
    if (rows.length === 0) {
      console.log("No host was found with this id:", id);
      return null;  // Return null or handle as appropriate if no visitor is found
    }
    console.log("host found:", rows[0]);
    return rows[0];  // Return the first visitor if found
  } catch (error) {
    console.log("Error executing query:", error);
    return null;  // Handle the error as needed
  }
};

export const VisitModel = {
  findVisitByCode,
  sendMailConfirmation,
  findHostById
}


