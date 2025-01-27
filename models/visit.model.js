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
	    DECLARE @mailto AS nvarchar(1000)
      DECLARE @mailprofile AS nvarchar(100)
      DECLARE @mailsubject AS nvarchar(100)
      DECLARE @tableHTML AS NVARCHAR(MAX)   
        
      SET @mailprofile = 'OT Report Services Profile Mail'
      SET @mailsubject = 'Test 2' 

      SET @tableHTML= 
        N'<!DOCTYPE html>' +
      N'<html lang="en">' +
      N'<head>' +
      N'  <meta charset="UTF-8">' +
      N'  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      N'  <title>Visit Code Email</title>' +
      N'  <style>' +
      N'    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000; color: #000000; }' +
      N'    table { width: 100%; border-collapse: collapse; }' +
      N'    .container { width: 600px; margin: 0 auto; background-color: #ffffff; text-align: center; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); }' +
      N'    .logo { width: 100%; max-width: 600px; display: block; margin-bottom: 20px; }' +
      N'    .code { font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px; }' +
      N'    .cta-button { background-color: #000000; color: #ffffff; font-size: 16px; padding: 10px 20px; border: none; cursor: pointer; text-decoration: none; display: inline-block; margin-bottom: 20px; }' +
      N'    .cta-button:hover { background-color: #333333; }' +
      N'  </style>' +
      N'</head>' +
      N'<body style="background-color: #000000; color: #000000;">' +
      N'  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
      N'    <tr>' +
      N'      <td style="text-align: center; padding: 20px; background-color: #000000;">' +
      N'        <!-- Logo with proper spacing and alignment -->' +
      N'        <img src="images/logo.jpg" alt="Logo" class="logo" style="max-width: 600px; margin-bottom: 20px;">' +
      N'      </td>' +
      N'    </tr>' +
      N'    <tr>' +
      N'      <td style="text-align: center; padding: 20px;">' +
      N'        <table class="container" role="presentation" cellpadding="0" cellspacing="0">' +
      N'          <tr>' +
      N'            <td style="font-size: 20px; font-weight: bold; margin-bottom: 20px;">Hi ' + @name + ',</td>' +
      N'          </tr>' +
      N'          <tr>' +
      N'            <td style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">' +
      N'              Here is your visit code:' +
      N'            </td>' +
      N'          </tr>' +
      N'          <tr>' +
      N'            <td class="code">' +
      N'              ' + @code + '' +
      N'            </td>' +
      N'          </tr>' +
      N'          <tr>' +
      N'            <td style="font-size: 16px; line-height: 1.5; margin-bottom: 0px;">' +
      N'              Please copy the code above and share it with your invitees' +
      N'            </td>' +
      N'          </tr>' +
      N'          <tr>' +
      N'            <td style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">' +
      N'              so they can access our facilities with no further registration.' +
      N'            </td>' +
      N'          </tr>' +
      N'          <tr>' +
      N'            <td style="font-size: 14px; color: #666666; margin-top: 20px;">' +
      N'              Thank you for your attention!' +
      N'            </td>' +
      N'          </tr>' +
      N'          <tr>' +
      N'        </table>' +
      N'      </td>' +
      N'    </tr>' +
      N'  </table>' +
      N'</body>' +
      N'</html>'

      BEGIN TRY
        EXEC [mxjc-m2s11srvt1].msdb.dbo.sp_send_dbmail
          @recipients = @recipient,
          @profile_name = @mailprofile,
          @subject = @mailsubject,
          @body = @tableHTML,
          @body_format = 'HTML',
          @importance = 'HIGH'
      END TRY
      BEGIN CATCH
        SELECT ERROR_MESSAGE() AS Result
      END CATCH
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


