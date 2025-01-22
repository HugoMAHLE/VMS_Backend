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


export const UserModel = {
  createUser,
  findOneByEmail,
  findOneById,
  getEmail,
  getUID
};

export default UserModel;
