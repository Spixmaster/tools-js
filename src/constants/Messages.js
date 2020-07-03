const Tools = require("../Tools");

/**
 * @class Messages
 * @brief A container for all messages.
 * @details This object is used to store all messages which are used throughout the programme.
 */
class Messages
{
    //Member functions
    /**
     * @brief Logs an error message that the file does not exist.
     * @param[in] file {string} The file name which is included in the error message.
     */
    static file_non_existent(file)
    {
        return `The file \"${file}\" does not exist.`;
    }
    
    /**
     * @brief Returns a message that asks for a positive line number as there are no negative ones.
     * @param[in] file The file name which is included in the error message.
     * @return {string} The message.
     */
    static enter_pos_num_to_read_in_file(file)
    {
        return `You need to enter a positive value and greater than 0 to read in \"${file}\".`;
    }
    
    /**
     * @brief Message that the given string is empty.
     * @return {string} The message.
     */
    static given_str_empty()
    {
        return "The given string is empty.";
    }
};

module.exports = Messages;
