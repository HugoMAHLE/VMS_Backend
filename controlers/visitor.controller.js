import { VisitorModel } from "../models/visitor.model.js";
import jwt from 'jsonwebtoken'


// api/v1/visitor/create
const createVisitor = async(req, res) => {
  try{
    const {fname, lname, email, phone, company} = req.body

    if(!fname || !lname || !email || !phone || !company){
      return res.status(400).json({ ok: false, msg: "Missing Data" })
    }

    const visitor = await VisitorModel.findVisitorByEmail(email)
    if(visitor) {
      return res.status(409).json({ ok: false, msg: "Visitor already exist" })
    }

    const newvisitor = await VisitorModel.createVisitor({fname,lname, email, phone, company})
    return res.status(201).json({ok:true})

  }catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Error del servidor' + error
    })

  }
}

// api/v1/visitor/createvisit
const createVisit = async (req, res) => {
  try {
    const { name, reason, date, entry, uid, visitors } = req.body;

    if (!name || !reason || !date || !entry || !visitors || visitors.length === 0) {
      return res.status(400).json({ ok: false, msg: "Missing Data" });
    }

    const newVisit = await VisitorModel.createVisit(name, reason, date, entry, uid);

    if (!newVisit) {
      return res.status(500).json({ ok: false, msg: "Failed to create visit" });
    }
    const visitID = newVisit[0].visitID;
    const linkedVisitors = await VisitorModel.linkVisitorsToVisit(visitors, visitID);

    if (!linkedVisitors) {
      return res.status(500).json({ ok: false, msg: "Failed to link visitors to the visit" });
    }

    return res.status(201).json({ ok: true, msg: "Visit created successfully" });
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

//api/v1/visitor/companies
const getCompanies = async (req, res) => {
  try {
    const companies = await VisitorModel.getAllCompanies(); // Fetch visitors
    return res.status(200).json({ ok: true, msg: companies }); // Send successful response
  } catch (error) {
    console.error('Error fetching companies:', error); // Log error for debugging
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching companies', // Provide a more descriptive error message
    });
  }
};

export const VisitorController = {
  createVisitor,
  getVisitors,
  getCompanies,
  addCompany,
  createVisit
}
