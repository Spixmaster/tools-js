const path = require("path");

/**
 * @class Constants
 * @brief A container for all constants.
 * @details This object is used to store all constants which are used throughout the programme.
 */
class Constants
{
    //Member functions
    /**
     * @brief Returns the version.
     * @return {string} The version.
     */
    static version()
    {
        return "1.1.3";
    }

    /**
     * @brief Returns the release date.
     * @return {string} The release date.
     */
    static release()
    {
        return "04.Jul.2020";
    }

    /**
     * @brief Returns the maximum amount of temporary error logs that are saved.
     * @return {int} The number.
     */
    static max_tmp_err_logs()
    {
        return 10;
    }

    //Folders
    /**
     * @brief Returns the folder name for the files.
     * @return {string} The folder name.
     */
    static folder()
    {
        //We are currently in "root/tools-js/src/constants/" but we want to reach root.
        return path.join(__dirname, "../../../files/");
    }

    /**
     * @brief Returns the folder for the error logs.
     * @return {string} The folder name.
     */
    static folder_error_logs()
    {
        return this.folder() + "error-logs/";
    }

    /**
     * @brief Returns the folder for the temporary error logs.
     * @return {string} The folder name.
     */
    static folder_error_logs_tmp()
    {
        return this.folder() + "error-logs-tmp/";
    }

    //Files
    /**
     * @brief Returns the name to the file to which an error message is written.
     * @return {string} The file name.
     */
    static file_err_log()
    {
        return this.folder_error_logs() + Date.now().toString() + ".txt";
    }

    /**
     * @brief Returns the name to the file to which an error message is written.
     * @details The temporary error log will be deleted after a while.
     * @return {string} The file name.
     */
    static file_err_log_tmp()
    {
        return this.folder_error_logs_tmp() + Date.now().toString() + ".txt";
    }
};

module.exports = Constants;
