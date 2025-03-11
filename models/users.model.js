import {db} from '../database/connection.database.js'

const createUser = async({userid, email, pass, utype}) => {
  const query = {
    text: `
      insert into users (userid, email, pass, utype)
      values ($1, $2, $3, $4)
      returning userid
    `,
    values: [userid, email, pass, utype]
  }

  const {rows} = await db.query(query)
  return rows[0]
}


const findOneByEmail = async(email) => {
  const query = {
    text: `
    select * from users
    where email = $1
    `,
    values: [email]
  }
  const {rows} = await db.query(query)
  return rows[0]
}


const findOneById = async(userid) => {
  const query = {
    text: `
    select u.*, ut.type from users u
    join "userType"  ut on u.utype = ut.typeid
    where userid = $1
    `,
    values: [userid]
  }
  const {rows} = await db.query(query)
  return rows[0]
}


const getEmail = async(id) => {
  const query = {
    text: `
    select email from users
    where userid = $1
    `,
    values: [id]
  }
  const {rows} = await db.query(query)
  return rows[0]
}


const getUID = async(id) => {
  const query = {
    text: `
    select uid from users
    where userid = $1
    `,
    values: [id]
  }
  const {rows} = await db.query(query)
  return rows[0]
}


const getHostName = async(uid) => {
  const query = {
    text: `
    SELECT CONCAT(u."firstName", ' ', u."lastName") AS full_name
    FROM users u
    WHERE u.uid = $1
    `,
    values: [uid]
  }
  const {rows} = await db.query(query)
  return rows[0]
}


const getHostVisits = async(userid) => {
  const query = {
    text: `
    SELECT v.date, v."setHour", c.company, COUNT(vvr."vvID") AS visitor_count
    FROM visits v
    LEFT JOIN companies c ON v."companyID" = c.id
    LEFT JOIN "visitorvisitR" vvr ON v."visitID" = vvr."visitID"
    WHERE v.userid = (SELECT uid FROM users WHERE userid = $1)
    GROUP BY v.date, v."setHour", c.company;
    `,
    values: [userid]
  }
  const {rows} = await db.query(query)
  return rows;
}


export const UserModel = {
  createUser,
  findOneByEmail,
  findOneById,
  getEmail,
  getUID,
  getHostVisits,
  getHostName
};

export default UserModel;
