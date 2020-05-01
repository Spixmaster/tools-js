/**
 * @class Messages
 * @brief A container for all messages.
 * @details This object is used to store all messages which are used throughout the programme.
 */
class Messages
{
    //member functions
    /**
     * @brief Returns a message.
     * @return {string} A message.
     */
    static country_code_non_existent()
    {
        return "This country code does not exist!";
    }

    /**
     * @brief Returns a message.
     * @return {string} A message.
     */
    static verification_code_sent_via_app()
    {
        return "The verification code has been sent to your Telegram account.";
    }

    /**
     * @brief Returns a message.
     * @return {string} A message.
     */
    static verification_code_sent_via_sms()
    {
        return "The verification code has been sent to you via SMS.";
    }

    /**
     * @brief Returns a message.
     * @return {string} A message.
     */
    static ask_for_verification_code()
    {
        return "Enter your verification code: ";
    }

    /**
     * @brief Returns a message.
     * @return {string} A message.
     */
    static successful_login()
    {
        return "Your account logged in successfully!";
    }

    /**
     * @brief Returns a message.
     * @return {string} A message.
     */
    static verification_code_wrong()
    {
        return "The verification code is wrong.";
    }

    /**
     * @brief Returns a message.
     * @param[in] pw_hint {string} The password hint. It may be empty.
     * @return {string} A message.
     */
    static additional_pw(pw_hint)
    {
        if(pw_hint.length === 0)
        {
            return "You have set up an additional password. Enter it: ";
        }
        else
        {
            return `You have set up an additional password with password hint '${pw_hint}'. Enter it: `;
        }
    }
};

module.exports = Messages;