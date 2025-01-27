import {db} from '../database/connection.database.js'
import {edb} from '../database/email.database.js'

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

const sendMailConfirmation = async (code, recipient, name) => {
  const query = {
    text: `     
	    INSERT INTO Mailing (email, host, code, sent)
      VALUES (@recipient, @name, @code, 0)
    `
  };

  try {
    const result = await edb.request()
      .input('code', code)
      .input('recipient', recipient)
      .input('name', name)
      .query(query);

    console.log("Query result:", result);

    if (!result || !result.recordset || result.recordset.length === 0) {
      console.log("No rows returned from query.");
      return null;
    }

    console.log("Email sent successfully:", result.recordset[0]);
    return result.recordset[0];
  } catch (error) {
    console.error("Error executing query:", error);
    return null;
  }
  
  // try {
  //   const { rows } = await (await edb).request().query(query);
  //   console.log("Code:", code);
  //   console.log("Recipient:", recipient);
  //   console.log("Name:", name);
  //   console.log("Mail Query result:", rows); // Check the query result
  //   if (rows.length === 0) {
  //     console.log("Error sending code:", code);
  //     return null;  // Return null or handle as appropriate if no visitor is found
  //   }
  //   console.log("Email Status:", rows[0]);
  //   return rows[0];  // Return the first visitor if found
  // } catch (error) {
  //   console.log("Error executing query:", error);
  //   return null;  // Handle the error as needed
  // }
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


