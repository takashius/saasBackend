import { set, connect as _connect } from "mongoose";
import config from "./commons";
set("debug", config.monDebug);

async function connect(url: string) {
  try {
    await _connect(url, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("[db] Connection successful", url);
  } catch (err) {
    console.error(`DB Connection Error: ${err.message}`);
  }
}

export default connect;
