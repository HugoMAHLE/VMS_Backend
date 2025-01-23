import {db} from '../database/connection.database.js'

const findVisitByCode = async (code) => {
  const query = {
    text: `
    select * from visits
    where code = $1
    `,
    values: [code]
  };

  try {
    const { rows } = await db.query(query);
    console.log("Query result:", rows); // Check the query result
    if (rows.length === 0) {
      console.log("No visit was found with this code:", email);
      return null;  // Return null or handle as appropriate if no visitor is found
    }
    console.log("Visit found:", rows[0]);
    return rows[0];  // Return the first visitor if found
  } catch (error) {
    console.log("Error executing query:", error);
    return null;  // Handle the error as needed
  }
};



export const VisitModel = {
  findVisitByCode
}


