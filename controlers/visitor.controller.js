const { VisitorModel } = require("../models/visitor.model.js");
const { UserModel } = require("../models/users.model.js");
const jwt = require('jsonwebtoken')


// api/v1/visitor/create
const createVisitor = async (req, res) => {
  try {
    const { type, fname, lname, email, phone, company, citizenship } = req.body;
    logger("request: " + citizenship, "createVisitor 1", "Debug" );
    console.log("request: " + citizenship, "createVisitor 1", "Debug" );

    if (!type || !fname || !lname || !email || !phone || !company || !citizenship) {
      logger("Missed Data", "createVisitor 2", "Debug" );
      return res.status(400).json({ ok: false, msg: "Missing Data" });
    }

    const citizenshipid = parseInt(citizenship)

    const existingVisitor = await VisitorModel.findVisitorByEmail(email);
    if (existingVisitor) {
      logger("Visitor exists", "createVisitor 3", "Debug" );
      return res.status(409).json({ ok: false, msg: "Visitor already exist" });
    }

    const client = await db.connect();
    try {
      await client.query('BEGIN');

      let companyRecord = await VisitorModel.findCompanyByName(company, client);
      let companyId;
      if (companyRecord) {
        companyId = companyRecord.id;
      } else {
        const newCompany = await VisitorModel.createCompany(company, client);
        companyId = newCompany.id;
      }

      logger("creating Visitor", "createVisitor 4", "Debug" );
      console.log("creating Visitor ", citizenshipid, "createVisitor 4", "Debug" );
      await VisitorModel.insertVisitor(type, fname, lname, email, phone, companyId, client, citizenshipid);
      logger("insert success", "createVisitor 5", "Debug" );

      await client.query('COMMIT');
      return res.status(201).json({ ok: true });
    } catch (error) {
      logger("Error occurred. Rolling back transaction... " + error, "createVisitor", "Error" );
      await client.query('ROLLBACK');
      return res.status(500).json({ ok: false, msg: 'Transaction error: ' + error });
    } finally {
      logger("create success", "createVisitor 6", "Debug" );
      client.release();
    }
  } catch (error) {
    logger("Server error: "  + error, "createVisitor ", "Error" );
    return res.status(500).json({ ok: false, msg: 'Error del servidor: ' + error });
  }
};
// const createVisitor = async(req, res) => {
//   try{
//     const {type, fname, lname, email, phone, company} = req.body

//     if(!type || !fname || !lname || !email || !phone || !company){
//       return res.status(400).json({ ok: false, msg: "Missing Data" })
//     }

//     const visitor = await VisitorModel.findVisitorByEmail(email)
//     if(visitor) {
//       return res.status(409).json({ ok: false, msg: "Visitor already exist" })
//     }

//     const newvisitor = await VisitorModel.createVisitor({type, fname,lname, email, phone, company})
//     return res.status(201).json({ok:true})

//   }catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       ok: false,
//       msg: 'Error del servidor' + error
//     })

//   }
// }

const getVisitorByEmail = async (req, res) => {
  const { email } = req.query;
  const visitor = await VisitorModel.findVisitorByEmail(email);
  console.log("request found for visitor: " + visitor)
  return res.status(201).json(visitor);
}

// api/v1/visitor/createvisit
const createVisit = async (req, res) => {
  try {
    const { name, reason, date, entry, uid, visitors } = req.body;

    if (!name || !reason || !date || !entry || !visitors || visitors.length === 0) {
      return res.status(400).json({ ok: false, msg: "Missing Data" });
    }

    const response = await UserModel.getHostPlant(uid);
    const plant = response.plant;
    const newVisit = await VisitorModel.createVisit(name, reason, date, entry, uid, plant);

    if (!newVisit) {
      return res.status(500).json({ ok: false, msg: "Failed to create visit" });
    }
    const visitID = newVisit[0].visitID;
    const linkedVisitors = await VisitorModel.linkVisitorsToVisit(visitors, visitID);

    if (!linkedVisitors) {
      return res.status(500).json({ ok: false, msg: "Failed to link visitors to the visit" });
    }
    const newCode = newVisit[0].code
    return res.status(201).json({ ok: true, msg: newCode });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Server Error: " + error.message,
    });
  }
};

// api/v1/visitor/addcompany
const addCompany = async(req, res) => {
  try{
    const { company } = req.body

    if(!company){
      return res.status(400).json({ ok: false, msg: "Missing Data" })
    }

    const found = await VisitorModel.FindCompany(company)
    if(found) {
      return res.status(409).json({ ok: false, msg: "Company already exist" })
    }

    const newCompany = await VisitorModel.AddCompany(company)
    return res.status(201).json({ok:true})

  }catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor' + error
    })

  }
}

// api/v1/visitor/visitors
const getVisitors = async (req, res) => {
  try {
    const visitors = await VisitorModel.getAllVisitors(); // Fetch visitors
    return res.status(200).json({ ok: true, msg: visitors }); // Send successful response
  } catch (error) {
    console.error('Error fetching visitors:', error); // Log error for debugging
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching visitors', // Provide a more descriptive error message
    });
  }
};

const getVisitorsWithVisitID = async (req, res) => {
  const { id } = req.query

  try {
    const visitors = await VisitorModel.getVisitorsOnVisit(id); // Fetch visitors
    return res.status(200).json({ ok: true, msg: visitors }); // Send successful response
  } catch (error) {
    console.error('Error fetching visitors:', error); // Log error for debugging
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching visitors', // Provide a more descriptive error message
    });
  }
};

//api/v1/visitor/companies
const getCompanies = async (req, res) => {
  try {
    logger("Companies requested", "getCompanies 1", "Debug" );
    const companies = await VisitorModel.getAllCompanies(); // Fetch Companies
    return res.status(200).json({ ok: true, msg: companies }); // Send successful response
  } catch (error) {
    logger("Error fetching companies", "getCompanies", "Error" );
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching companies', // Provide error message
    });
  }
};

//api/v1/visitor/companie-by-id
const getCompanyByID = async (req, res) => {
  const { id } = req.query

  try {
    const company = await VisitorModel.getCompanyByID(id); // Fetch visitors
    return res.status(200).json({ company }); // Send successful response
  } catch (error) {
    console.error('Error fetching visitors:', error); // Log error for debugging
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching visitors', // Provide error message
    });
  }
};

//api/v1/visitor/get-country
const getCitizenshipByVisitorID = async (req, res) => {
  const { visitorid } = req.query
  try {
    const visitor = await VisitorModel.getVisitorByID(visitorid);
    const citizenshipID = visitor.citizenshipid
    const citizenship = await VisitorModel.getCountryByID(citizenshipID); // Fetch visitors
    return res.status(200).json( citizenship ); // Send successful response
  } catch (error) {
    console.error('Error fetching visitor with id: ' + visitorid , error); // Log error for debugging
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching visitors', // Provide error message
    });
  }
};

// api/v1/visitor/update-status
// const updateVisitorStatus = async(req, res) => {
//   try{
//     const { status, visitorid } = req.body

//     if(!status || !visitorid){
//       return res.status(400).json({ ok: false, msg: "Missing Data" })
//     }

//     const updated = await VisitorModel.updateStatus(status, visitorid, visitid)
//     if(updated) {
//       return res.status(201).json({ok:true})
//     }else{
//       return res.status(400).json({ ok: false, msg: "Error on update" })
//     }
//   }catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       ok: false,
//       msg: 'Error del servidor' + error
//     })

//   }
// }

const updateVisitorStatus = async(req, res) => {
  try{
    const { statusid, visitorid, visitid } = req.body 
    console.log(`requested update: ${statusid}, ${visitorid}, ${visitid}`)

    if(!statusid || !visitorid || !visitid){ 
      return res.status(400).json({ ok: false, msg: "Missing Data" })
    }

    const updated = await VisitorModel.updateStatus(statusid, visitorid, visitid)
    if(updated && updated.length > 0) { 
      return res.status(201).json({ok:true})
    } else {
      return res.status(400).json({ ok: false, msg: "Error on update" })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor: ' + error
    })
  }
}

const updateVisitorMigration = async(req, res) => {
  try{
    const { migrationNbr, visitorid } = req.body 
    console.log(`requested update: ${visitorid}, ${migrationNbr}`)

    if( !visitorid || !migrationNbr){ 
      return res.status(400).json({ ok: false, msg: "Missing Data" })
    }

    const updated = await VisitorModel.updateMigration(migrationNbr, visitorid)
    if(updated && updated.length > 0) { 
      return res.status(201).json({ok:true})
    } else {
      return res.status(400).json({ ok: false, msg: "Error on update" })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor: ' + error
    })
  }
}

const getVisitorMigration = async(req, res) => {
  try{
    const { visitorid } = req.body 
    console.log(`requested update: ${visitorid}`)

    if( !visitorid ){ 
      return res.status(400).json({ ok: false, msg: "Missing Data" })
    }

    const visitor = await VisitorModel.getMigration(visitorid)
    if(visitor) { 
      return res.status(201).json(visitor)
    } else {
      return res.status(400).json({ ok: false, msg: "Error on update" })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor: ' + error
    })
  }
}

const updateLabelPrintStatus = async(req, res) => {
  try{
    const { visitorid, visitid } = req.body 

    if( !visitorid || !visitid){ 
      return res.status(400).json({ ok: false, msg: "Missing Data" })
    }

    const updated = await VisitorModel.printStatus( visitorid, visitid)
    if(updated && updated.length > 0) { 
      return res.status(201).json({ok:true})
    } else {
      return res.status(400).json({ ok: false, msg: "Error on update" })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor: ' + error
    })
  }
}


// api/v1/visitor/get-visitor-status
const getVisitorStatus = async(req, res) => {
  try{
    const { visitorid, visitid } = req.query

    if( !visitorid || !visitid){
      return res.status(400).json({ ok: false, msg: "Missing Data" })
    }

    const response = await VisitorModel.getVisitorStatus(visitorid, visitid)
    if(response != null) {
      return res.status(201).json(response)
    }else{
      return res.status(400).json({ ok: false, msg: "Error on update" })
    }
  }catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor' + error
    })
  }
}

//  api/v1/visitor/countries
const getCountries = async(req, res) => {
  console.log("Reqiuested")
  try{
    const countries = await VisitorModel.countries();
    console.log(countries) 
    res.json(countries)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error retreiving countries.' })
  }
}

const VisitorController = {
  createVisitor,
  getVisitors,
  getVisitorByEmail,
  getCompanies,
  getCompanyByID,
  getCitizenshipByVisitorID,
  getCountries,
  getVisitorMigration,
  addCompany,
  createVisit,
  getVisitorsWithVisitID,
  getVisitorStatus,
  updateVisitorStatus,
  updateLabelPrintStatus,
  updateVisitorMigration,
}

module.exports = { VisitorController };
