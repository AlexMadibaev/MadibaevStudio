import mysql from "mysql2/promise";

const configured = Boolean(process.env.MYSQL_HOST);
export const database = configured
  ? mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
    })
  : null;

export const useDatabase = async () => {
  if (!database) return false;
  await database.query("SELECT 1");
  return true;
};
