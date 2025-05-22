import "./db/config.js"
import {pool} from "./db/config.js";

const createUser = () =>
  pool.query(`CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);
`);

export default createUser;