import jwt from "jsonwebtoken";
import { kv } from "@vercel/kv";
import { AccessError, InputError } from "./error.js";

const JWT_SECRET = "llamallamaduck";

/***************************************************************
                       Auth Helpers
***************************************************************/

const getAdmins = async () => {
  const admins = await kv.get("admins");
  return admins || {};
};

const setAdmins = async (admins) => {
  await kv.set("admins", admins);
};

/***************************************************************
                       Auth Functions
***************************************************************/

export const getEmailFromAuthorization = (authorization) => {
  if (!authorization) throw new AccessError("Missing token");

  try {
    const token = authorization.replace("Bearer ", "");
    const { email } = jwt.verify(token, JWT_SECRET);
    return email;
  } catch {
    throw new AccessError("Invalid token");
  }
};

export const login = async (email, password) => {
  const admins = await getAdmins();

  if (!(email in admins) || admins[email].password !== password) {
    throw new InputError("Invalid username or password");
  }

  return jwt.sign({ email }, JWT_SECRET);
};

export const logout = async () => {
  return;
};

export const register = async (email, password, name) => {
  const admins = await getAdmins();

  if (email in admins) {
    throw new InputError("Email already registered");
  }

  admins[email] = {
    name,
    password,
    store: {},
  };

  await setAdmins(admins);

  return jwt.sign({ email }, JWT_SECRET);
};

/***************************************************************
                       Store Functions
***************************************************************/

export const getStore = async (email) => {
  const admins = await getAdmins();

  if (!(email in admins)) {
    throw new AccessError("User not found");
  }

  return admins[email].store;
};

export const setStore = async (email, store) => {
  const admins = await getAdmins();

  if (!(email in admins)) {
    throw new AccessError("User not found");
  }

  admins[email].store = store;

  await setAdmins(admins);
};
