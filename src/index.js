const TelegramUser = require("./TelegramUser");
const fs = require("fs");
const Constants = require("./constants/Constants");

/**
 * @mainpage telegram-user-adder
 * @author Matheus Gabriel Werny de Lima
 * @copyright /
 * @version
 * 0.0.3 (22.04.2020)
 * - The login process should be ready now but there is probably still much to debug.
 * @version
 * 0.0.2 (21.04.2020)
 * - Added handling of verification code.
 * @version
 * 0.0.1 (20.04.2020)
 * - Starting the project.
 */

 //create necessary folders
if(!fs.existsSync(Constants.folder()))
{
    fs.mkdirSync(Constants.folder());
}

let tg_user = new TelegramUser("+49", "17693778879");