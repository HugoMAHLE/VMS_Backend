import { VisitModel } from "../models/visit.model.js";
import { VisitorModel } from "../models/visitor.model.js";

// api/v1/get-visit-info
const getVisit = async (req, res) => {
  const { code } = req.query;
     
  try {
    if (!code) {
      return res.status(400).json({ ok: false, msg: 'Visit code is required' });
    }
    
    const visit = await VisitModel.findVisitByCode(code);
    console.log("Visit ifnformation soun=d: " + visit.visitID)
    return res.status(200).json({ ok: true, msg: visit });
  } catch (error) {
    console.error('Error fetching visit:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching the visit info',
    });
  }
};

//api/v1/recep-visits
const getRecepVisit = async (req, res) => {
  const { plant } = req.query;
  console.log("reached checkpoint 1");
  try{
    if (!plant) {
      console.log("reached checkpoint 2");
      return res.status(400).json({ ok: false, msg: 'All info is required' });
    }
    console.log('plant received:', plant);

    const response = await VisitModel.getRecepVisit(plant)
    console.log("reached checkpoint 3: " + response);
    return res.status(200).json({ ok: true, msg: response });

  }catch(error){
    console.error('Error fetching visit:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching the visits info',
    });
  }
};

//api/v1/rec-guests
const getVisitGuests = async (req, res) => {
  const { code } = req.query;
  console.log("reached checkpoint 1");
  try{
    if (!code) {
      console.log("reached checkpoint 2");
      return res.status(400).json({ ok: false, msg: 'A code is required' });
    }
    console.log('code received:', code);

    const visit = await VisitModel.findVisitByCode(code)
    const response = await VisitModel.getVisitGuests(visit.visitID)
    console.log("reached chackpoint 3");
    return res.status(200).json({ ok: true, msg: response });

  }catch(error){
    console.error('Error fetching guests:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error occurred while fetching the guests',
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
  sendCode,
  getRecepVisit,
  getVisitGuests
}
