import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const swaggerDocument = require("../swagger.json");

import { AccessError, InputError } from "./error.js";
import {
  getEmailFromAuthorization,
  getStore,
  login,
  logout,
  register,
  save,
  setStore,
} from "./service.js";

const app = express();

/***************************************************************
                        Health Check
***************************************************************/
app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

/***************************************************************
                        Error Wrapper
***************************************************************/
const catchErrors = (fn) => async (req, res) => {
  try {
    await fn(req, res);
    save();
  } catch (err) {
    if (err instanceof InputError) {
      return res.status(400).json({ error: err.message });
    } else if (err instanceof AccessError) {
      return res.status(403).json({ error: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ error: "A system error occurred" });
    }
  }
};

/***************************************************************
                        Auth Middleware
***************************************************************/
const authed = (fn) => async (req, res) => {
  const email = getEmailFromAuthorization(req.header("Authorization"));
  await fn(req, res, email);
};

/***************************************************************
                        Auth Routes
***************************************************************/
app.post(
  "/admin/auth/login",
  catchErrors(async (req, res) => {
    const { email, password } = req.body;
    const token = await login(email, password);
    return res.json({ token });
  })
);

app.post(
  "/admin/auth/register",
  catchErrors(async (req, res) => {
    const { email, password, name } = req.body;
    const token = await register(email, password, name);
    return res.json({ token });
  })
);

app.post(
  "/admin/auth/logout",
  catchErrors(
    authed(async (req, res, email) => {
      await logout(email);
      return res.json({});
    })
  )
);

/***************************************************************
                        Store Routes
***************************************************************/
app.get(
  "/store",
  catchErrors(
    authed(async (req, res, email) => {
      const store = await getStore(email);
      return res.json({ store });
    })
  )
);

app.put(
  "/store",
  catchErrors(
    authed(async (req, res, email) => {
      await setStore(email, req.body.store);
      return res.json({});
    })
  )
);

/***************************************************************
                        Docs + Root
***************************************************************/
app.get("/", (req, res) => res.redirect("/docs"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
