const path = require("path");

/**
 * @class Constants
 * @brief A container for all constants.
 * @details This object is used to store all constants which are used throughout the programme.
 */
class Constants
{
    //member functions
    /**
     * @brief Returns the version.
     * @return {string} The version.
     */
    static version()
    {
        return "0.0.3";
    }

    /**
     * @brief Returns the release date.
     * @return {string} The release date.
     */
    static release()
    {
        return "22.04.2020";
    }

        //Files
    /**
     * @brief Returns the folder name for the files.
     * @return {string} The folder name.
     */
    static folder()
    {
        //.. as we are currently in "root/src/constants/".
        return path.join(__dirname, "..", "..", "files/");
    }

    /**
     * @brief Returns the suitable cookie file name.
     * @param[in] phone_number {string} The phone number is used to identify the corresponding Telegram account.
     * @return {string} The file name.
     */
    static file_cookies(phone_number)
    {
        return `${Constants.folder()}cookies-${phone_number}.dat`;
    }
};

module.exports = Constants;