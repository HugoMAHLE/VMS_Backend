import {db} from '../database/connection.database.js'

const createVisitor = async ({ fname, lname, email, phone, company }) => {
  console.log("Starting createVisitor function...");
  console.log("Received data:", { fname, lname, email, phone, company });

  const client = await db.connect();
  try {
    console.log("Database connection established. Beginning transaction...");
    await client.query('BEGIN');

    const companyQuery = {
      text: `SELECT id FROM companies WHERE company = $1`,
      values: [company],
    };
    console.log("Checking if company exists with query:", companyQuery);

    const companyResult = await client.query(companyQuery);
    console.log("Company query result:", companyResult.rows);

    let companyId;
    if (companyResult.rows.length > 0) {
      companyId = companyResult.rows[0].id;
      console.log("Company exists. Using company ID:", companyId);
    } else {
      const insertCompanyQuery = {
        text: `INSERT INTO companies (company) VALUES ($1) RETURNING id`,
        values: [company],
      };
      console.log("Inserting new company with query:", insertCompanyQuery);

      const insertCompanyResult = await client.query(insertCompanyQuery);
      companyId = insertCompanyResult.rows[0].id;
      console.log("New company inserted. Company ID:", companyId);
    }

    const visitorQuery = {
      text: `
        INSERT INTO visitors (firstName, lastName, email, phone, companyid)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING email
      `,
      values: [fname, lname, email, phone, companyId],
    };
    console.log("Inserting visitor with query:", visitorQuery);

    const visitorResult = await client.query(visitorQuery);
    console.log("Visitor insertion successful. Result:", visitorResult.rows);

    await client.query('COMMIT');
    console.log("Transaction committed successfully.");

    return visitorResult.rows[0];
  } catch (error) {
    console.error("Error occurred. Rolling back transaction...");
    await client.query('ROLLBACK');
    console.error("Error details:", error);
    throw error;
  } finally {
    client.release();
    console.log("Database connection released.");
  }
};

const getAllVisitors = async () => {
  try {
    const query = {
      text: `
      SELECT v.*, c.company FROM visitors v
      left Join companies c
      on v.companyid = c.id`,
    };
    const { rows } = await db.query(query);

    return rows || [];
  } catch (error) {
    console.error('Error fetching visitors from the database:', error);
    throw new Error('Database query failed');
  }
};

const getAllCompanies = async () => {
  try {
    const query = {
      text: `SELECT * FROM companies`,
    };
    const { rows } = await db.query(query);

    return rows.map(row => row.company) || [];
  } catch (error) {
    console.error('Error fetching companies from the database:', error);
    throw new Error('Database query failed');
  }
};

const AddCompany = async(company) => {
  try {
    const query = {
      text: `INSERT INTO companies (company) Values ($1)`,
      values: [company]
    };
    const { rows } = await db.query(query);
    return rows[0]
  } catch (error) {
    console.error('Error adding company to the database:', error);
    throw new Error('Database query failed');
  }
}

const FindCompany = async(company) => {
  const query = {
    text: `
    select * from companies
    where company = $1
    `,
    values: [company]
  }
  const {rows} = await db.query(query)
  return rows[0]
}

const GetCompanyID = async(company) => {
  const query = {
    text: `
    select id from companies
    where company = $1
    `,
    values: [company]
  }
  const {rows} = await db.query(query)
  return rows[0]
}

const findVisitorByEmail = async (email) => {
  const query = {
    text: `
    select * from visitors
    where email = $1
    `,
    values: [email]
  };

  try {
    const { rows } = await db.query(query);
    console.log("Query result:", rows); // Check the query result
    if (rows.length === 0) {
      console.log("No visitor found with this email:", email);
      return null;  // Return null or handle as appropriate if no visitor is found
    }
    console.log("Visitor found:", rows[0]);
    return rows[0];  // Return the first visitor if found
  } catch (error) {
    console.log("Error executing query:", error);
    return null;  // Handle the error as needed
  }
};


const findVisitorsByCompany = async(company) => {
  const query = {
    text: `
    select v.firstname, v.lastname, v.email, v.phone, c.company
    from visitors v
    join companies c on v.companyid = c.id
    where c.id = $1; }`,
    values: [company]
  }
  const {rows} = await db.query(query)
  return rows
}

const createVisit = async (name, reason, date, entry, uid) => {
  const response = await GetCompanyID(name);
  const companyid = response.id
  console.log("company: " + companyid)

  const query = {
    text: `
    INSERT INTO visits ("companyID", date, "setHour", "arrivalHour", "leaveHour", purpose, userid)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING "visitID"`,
    values: [companyid, date, entry, entry, entry, reason, uid],
  };

  const { rows } = await db.query(query);
  return rows;
};

const linkVisitorsToVisit = async (visitors, visitID) => {
  const status = 3
  const queryText = `
    INSERT INTO "visitorvisitR" ("visitID", "visitorID", "statusID")
    VALUES ($1, $2, $3)
  `;

  // Use a transaction to ensure all inserts succeed or roll back
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    for (const visitor of visitors) {
      let VisitorArr = await findVisitorByEmail(visitor.email)
      let visitorID = VisitorArr.visitorid
      await client.query(queryText, [visitID, visitorID, status]);
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error linking visitors:", error);
    return false;
  } finally {
    client.release();
  }
};


export const VisitorModel = {
  createVisitor,
  findVisitorByEmail,
  getAllVisitors,
  findVisitorsByCompany,
  getAllCompanies,
  AddCompany,
  FindCompany,
  createVisit,
  linkVisitorsToVisit
}


