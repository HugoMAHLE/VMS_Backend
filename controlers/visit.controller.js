import { VisitModel } from "../models/visit.model.js";
import jwt from 'jsonwebtoken'
import { VisitorModel } from "../models/visitor.model.js";

// api/v1/get-visit-info
const getVisit = async (req, res) => {
  const { code } = req.query;
   
  try {
    if (!code) {
      return res.status(400).json({ ok: false, msg: 'Visit code is required' });
    }
    console.log('Code received:', code);
    const visit = await VisitModel.findVisitByCode(code);
    return res.status(200).json({ ok: true, msg: visit });
  } catch (error) {
    console.error('Error fetching visit:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching the visit info',
    });
  }
};

// api/v1/send-code
const sendCode = async (req, res) => {
  const { code } = req.body;
   
  try {
    if (!code) {
      return res.status(400).json({ ok: false, msg: 'All info is required' });
    }
    console.log('Code received:', code);
    const visit = await VisitModel.findVisitByCode(code);
    const userID = visit.userid
    const visitID = visit.visitID

    const userInfo = await VisitModel.findHostById(userID);

    const email = userInfo.email;
    const name = userInfo.firstName;

    const mailingArray = await VisitorModel.getVisitorsOnVisit(visitID);

    for (const element of mailingArray) {
      const type = "guest";
      const vName = element.firstname + " " + element.lastname;
      const vEmail = element.email

      VisitModel.sendMailConfirmation(code, vEmail, vName, type);

    }

    const response = await VisitModel.sendMailConfirmation(code, email, name, "host");

    return res.status(200).json({ ok: true, msg: response });
  } catch (error) {
    console.error('Error fetching visit:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching the visit info',
    });
  }
};

export const VisitController = {
  getVisit,
  sendCode
}
