const Messages = require("./constants/Messages");
const Constants = require("./constants/Constants");
const fs = require("fs");

/**
 * @mainpage tools-js
 * @author Matheus Gabriel Werny de Lima
 * @copyright /
 * @version
 * 0.0.4 (15.05.2020)
 * - Minor updates.
 * @version
 * 0.0.3 (14.05.2020)
 * - Small code revision.
 * @version
 * 0.0.2 (01.05.2020)
 * - Source code update.
 * @version
 * 0.0.1 (01.05.2020)
 * - Writing the source code.
 */

/**
 * @class Tools
 * @brief A container for all useful functions
 */
class Tools
{
    //Member functions
    /**
     * @brief Saves error messages in a file.
     * @param[in] err {string} The error message to save.
     */
    static write_err_log(err)
    {
        //Create the folders if necessary.
        if(!fs.existsSync(Constants.folder()))
        {
            fs.mkdirSync(Constants.folder());
        }

        if(!fs.existsSync(Constants.folder_error_logs()))
        {
            fs.mkdirSync(Constants.folder_error_logs());
        }

        fs.writeFileSync(Constants.file_err_log(), err);
    }

    /**
     * @brief Saves error messages in a file.
     * @details All temporary error message logs are deleted after a while.
     * @param[in] err {string} The error message to save.
     */
    static write_err_log_tmp(err)
    {
        //Create the folders if necessary.
        if(!fs.existsSync(Constants.folder()))
        {
            fs.mkdirSync(Constants.folder());
        }

        if(!fs.existsSync(Constants.folder_error_logs_tmp()))
        {
            fs.mkdirSync(Constants.folder_error_logs_tmp());
        }

        //Perhaps, delete old error log.
        let files = fs.readdirSync(Constants.folder_error_logs_tmp());

        if(files.length >= Constants.max_tmp_err_logs())
        {
            //Element 0 is the oldest file as the files are sorted ascendingly.
            fs.unlinkSync(Constants.folder_error_logs_tmp() + files[0])
        }

        //Log the error.
        fs.writeFileSync(Constants.file_err_log_tmp(), err);
    }
}

module.exports = Tools;
