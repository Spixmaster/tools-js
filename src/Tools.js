const constants = require("./constants/Constants");
const fs = require("fs");
const messages = require("./constants/Messages");
const {execSync} = require("child_process");

/**
 * @mainpage tools-js
 * @author Matheus Gabriel Werny de Lima
 * @copyright Apache-2.0 License
 * @version
 * 1.1.6 (09.08.2020)
 * - Variables renamed.
 * @version
 * 1.1.5 (06.07.2020)
 * - Removed unnecessary require().
 * @version
 * 1.1.4 (04.07.2020)
 * - Bug fix.
 * @version
 * 1.1.3 (04.07.2020)
 * - Added a function.
 * @version
 * 1.1.2 (04.07.2020)
 * - Added function exec().
 * @version
 * 1.1.1 (03.07.2020)
 * - Variable update.
 * @version
 * 1.1.0 (03.07.2020)
 * - Added some functions.
 * @version
 * 1.0.6 (30.06.2020)
 * - NPM settings updated.
 * @version
 * 1.0.5 (25.06.2020)
 * - Doxygen fix.
 * @version
 * 1.0.4 (25.06.2020)
 * - License changed.
 * @version
 * 1.0.3 (21.06.2020)
 * - Removed contributing.
 * @version
 * 1.0.2 (04.06.2020)
 * - Code revision.
 * @version
 * 1.0.1 (04.06.2020)
 * - Contributing updated.
 * @version
 * 1.0.0 (23.05.2020)
 * - Contributing update.
 * @version
 * 0.0.7 (22.05.2020)
 * - An npm file was added.
 * @version
 * 0.0.6 (15.05.2020)
 * - Version fix.
 * @version
 * 0.0.5 (15.05.2020)
 * - Contributing.md update.
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
        if(!fs.existsSync(constants.folder()))
        {
            fs.mkdirSync(constants.folder());
        }

        if(!fs.existsSync(constants.folder_error_logs()))
        {
            fs.mkdirSync(constants.folder_error_logs());
        }

        fs.writeFileSync(constants.file_err_log(), err);
    }

    /**
     * @brief Saves error messages in a file.
     * @details All temporary error message logs are deleted after a while.
     * @param[in] err {string} The error message to save.
     */
    static write_err_log_tmp(err)
    {
        //Create the folders if necessary.
        if(!fs.existsSync(constants.folder()))
        {
            fs.mkdirSync(constants.folder());
        }

        if(!fs.existsSync(constants.folder_error_logs_tmp()))
        {
            fs.mkdirSync(constants.folder_error_logs_tmp());
        }

        //Perhaps, delete old error log.
        const files = fs.readdirSync(constants.folder_error_logs_tmp());

        if(files.length >= constants.max_tmp_err_logs())
        {
            //Element 0 is the oldest file as the files are sorted ascendingly.
            fs.unlinkSync(constants.folder_error_logs_tmp() + files[0])
        }

        //Log the error.
        fs.writeFileSync(constants.file_err_log_tmp(), err);
    }

    /**
     * @brief The function gets the line of a given file.
     * @details The first line is line 1.
     * @details Example: The function may get line 5 of a file.
     * @param[in] file {string} The file path to the file whose content we want.
     * @param[in] ln_num {int} The number needs to be greater than 0. It states the line we want.
     * @return {string} The file line with new line char included at the end is returned.
     * @retval "" The file or the file line does not exist.
     */
    static get_file_ln(file, ln_num)
    {
        if(fs.existsSync(file))
        {
            if(ln_num >= 1)
            {
                let count = 1;
                const file_cont = fs.readFileSync(file, "utf8");
                const lines = file_cont.split("\n");

                for(let j = 0; j < lines.length; ++j)
                {
                    if(count === ln_num)
                    {
                        return lines[j];
                    }

                    ++count;
                }

                return "";
            }
            else
            {
                Tools.write_err_log(messages.enter_pos_num_to_read_in_file(file));
				return "";
            }
        }
        else
        {
            Tools.write_err_log(messages.file_non_existent(file));
			return "";
        }
    }

    /**
     * @brief It is counted the number of lines a file has.
     * @details Empty lines do not count.
     * @param[in] file {string} The path to file.
     * @return {int} The amount of written lines in a file.
     * @retval -1 The file does not exist.
     */
    static get_amnt_file_lns(file)
    {
        if(fs.existsSync(file))
        {
            let count = 0;
            const file_cont = fs.readFileSync(file, "utf8");
            const lines = file_cont.split("\n");

            for(let j = 0; j < lines.length; ++j)
            {
                if(lines[j] !== "")
                {
                    ++count;
                }
            }

            return count;
        }
        else
        {
            Tools.write_err_log(messages.file_non_existent(file));
            return -1;
        }
    }

    /**
     * @brief All words in the passed string are listed down in a arrayz while one element represents a word.
     * @details It can handle new lines and several spaces as it neglects them and only gets the pure words.
     * @param[in] str {string} The string from which we want to get the arguments.
     * @return {array of string} The array where each element represents one argument.
     */
    static get_args(str)
    {
		let args = [];
		let word = "";

		for(let j = 0; j < str.length; ++j)
		{
			//Deal with the last char of the last word. Check that we do not add whitespace.
			if(j == (str.length - 1) && str.charAt(j) != ' ')
			{
				word += str.charAt(j);
				args.push(word);
				word = "";
				break;	//Otherwise, the next condition would be true.
			}

			//Add the chars.
			if(str.charAt(j) != ' ' && str.charAt(j) != '\n')
				word += str.charAt(j);

			/*
			 * Detect words.
			 * && word !== "" is used as a condition so that several spaces do not add empty elements in the array.
			 */
			if((str.charAt(j) == ' ' || str.charAt(j) == '\n') && word !== "")
			{
				args.push(word);
				word = "";
			}
		}

		return args;
    }

    /**
     * @brief This function gets keys out of files.
     * @details Key-value pairs are saved like: key0 key1 key2: value0 value1 value2
     * @param[in] ln {string} The file line whose key we want.
     * @return {string} The key of the line without ending colon.
     */
    static get_file_ln_key(ln)
    {
		if(ln !== "")
		{
			let result = "";
			let args = Tools.get_args(ln);

			for(let j = 0; j < args.length; ++j)
			{
				result += args[j];

                if(j != args.length - 1)
                {
                    result += " ";
                }

				//This condition defines when the key is over.
				if(args[j].endsWith(":"))
				{
					//At this moment, we have: "key0 key1 key2: " or "key0 key1 key2:"
                    while(result.endsWith(":") || result.endsWith(": "))
                    {
                        result = result.substring(0, result.length - 1);
                    }

					return result;
				}
			}

			return "";
		}
		else
		{
			Tools.write_err_log(messages.given_str_empty());
			return "";
		}
    }

    /**
     * @brief This function gets values out of settings files.
     * @details Key-value pairs are saved like: key0 key1 key2: value0 value1 value2
     * @param[in] ln {string} The file line whose value we want.
     * @return {string} The value of the line.
     */
    static get_file_ln_val(ln)
	{
		if(ln !== "")
		{
            let result = "";
			let args = Tools.get_args(ln);
			let add = false; //The variable indicates when chars need to be added to the output string.

			for(let j = 0; j < args.length; ++j)
			{
				if(add == true)
				{
					result += args[j];

					if(j != args.length - 1)
						result += " ";
				}

				//This condition defines when the chars are added to the result string.
                if(args[j].endsWith(":"))
                {
                    add = true;
                }
			}

			return result;
		}
		else
		{
			Tools.write_err_log(messages.given_str_empty());
			return "";
		}
    }
    
    /**
     * @brief It gets the first line which contains the passed key.
     * @details The whole string needs to be contained in the file line and not just a fraction.
     * @note How values are saved: key0 key1 key2: val0 val1
     * @param[in] file {string} Path to file whose content we want.
     * @param[in] key {string} The key of the file line we want.
     * @return {string} The file line which contains the whole key. No new line character at the end.
     * @retval "" There is no such key in the file.
     */
    static get_file_ln_w_key(file, key)
    {
        if(fs.existsSync(file))
        {
            const file_cont = fs.readFileSync(file, "utf8");
            const lines = file_cont.split("\n");

            for(let j = 0; j < lines.length; ++j)
            {
                if(lines[j] !== "")
                {
                    if(Tools.get_file_ln_key(lines[j]) == key)
                    {
                        return lines[j];
                    }
                }
            }

            return "";
        }
        else
        {
            Tools.write_err_log(messages.file_non_existent(file));
			return "";
        }
    }

    /**
     * @brief It gets the first line which contains the passed value.
     * @details The whole string needs to be contained in the value and not just a fraction.
     * @note How values are saved: key0 key1 key2: val0 val1
     * @param[in] file {string} Path to file whose content we want.
     * @param[in] val {string} The value of the file line we want.
     * @return {string} The file line which contains the whole value. No new line character at the end.
     * @retval "" There is no such value in the file.
     */
    static get_file_ln_w_val(file, val)
	{
        if(fs.existsSync(file))
        {
            const file_cont = fs.readFileSync(file, "utf8");
            const lines = file_cont.split("\n");

            for(let j = 0; j < lines.length; ++j)
            {
                if(lines[j] !== "")
                {
                    if(Tools.get_file_ln_val(lines[j]) == val)
                    {
                        return lines[j];
                    }
                }
            }

            return "";
        }
        else
        {
            Tools.write_err_log(messages.file_non_existent(file));
			return "";
        }
    }
    
    /**
     * @brief Calls a command and returns the stdout.
     * @param[in] cmd {string} The called command.
     * @return {string} The output made to stdout.
     */
    static exec(cmd)
    {
        let output = execSync(cmd).toString();
        //Remove the new line character at the end.
        output = output.substring(0, output.length - 1);
        return output;
    }

    /**
     * @brief The functions gets the content of the stated file except one line which is skipped.
     * @param[in] file {string} Path to file whose content we want.
     * @param[in] srch {string} String whose line shall not be included.
     * @return {string} Everything from the file except that one line is returned as a string. Additionally, a new line is included at the end which is important as when appending text I assume that it goes into a new line.
     * @retval "" An empty line is returned if the file does not exist.
     */
    static get_file_cont_wo_srch_ln(file, srch)
    {
        if(fs.existsSync(file))
        {
            let result = "";
            const file_cont = fs.readFileSync(file, "utf8");
            const lines = file_cont.split("\n");

            for(let j = 0; j < lines.length; ++j)
            {
                if(lines[j] !== srch)
                {
                    result += lines[j];
                    result += "\n";
                }
            }

            return result;
        }
        else
        {
            Tools.write_err_log(messages.file_non_existent(file));
            return "";
        }
    }
}

module.exports = Tools;
