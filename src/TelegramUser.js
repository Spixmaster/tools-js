const puppeteer = require("puppeteer");
const Messages = require("./constants/Messages");
const prompt = require('prompt-sync')();
const Constants = require("./constants/Constants");
const fs = require("fs");

/**
 * @class TelegramUser
 * @brief A representation of a Telegram user.
 * @details This object has all needed abilities which are required for the programme as it is mainly used for growing Telegram groups which is done by a Telegram user.
 */
class TelegramUser
{
    //constructors
    /**
     * @param[in] country_code {string} Country code of the phone number. Example for germany +49.
     * @param[in] tel_number {string} Telephone number without the country code like 17645916452.
     */
    constructor(country_code, tel_number)
    {
        this.m_country_code = country_code;
        this.m_tel_number = tel_number;
        this.m_login_url = "https://web.telegram.org/#/login";

        this.login();
    }

    //member functions
    /**
     * @todo Check whether user is already logged in.
     * @todo Remove the headless option.
     * @brief Logs in if not already.
     * @details At first, checks whether the user is already logged in and if not he is being logged in. Otherwise, the function is skipped.
     */
    login()
    {
        (async () =>
        {
            try
            {
                //Setup
                let browser = await puppeteer.launch({headless: false, defaultViewport: {width: 1280, height: 720}});
                let page = await browser.newPage();

                //Use the old cookies.
                if(fs.existsSync(Constants.file_cookies(`${this.m_country_code}${this.m_tel_number}`)))
                {
                    let file_cont = fs.readFileSync(Constants.file_cookies(`${this.m_country_code}${this.m_tel_number}`), "utf8");
                    
                    if(file_cont.length !== 0)
                    {
                        let cookies = JSON.parse(cookies);

                        if(Array.isArray(cookies))
                        {
                            for(let j = 0; j < cookies.length; ++j)
                            {
                                await page.setCookie(cookies[j]);
                            }
                        }
                    }
                }

                await page.goto(this.m_login_url, {waitUntil: "networkidle2"});

                //Check whether we are already logged in.
                if(page.url() !== "https://web.telegram.org/#/im")
                {
                    //Choose the right country.
                    await page.evaluate(() =>
                    {
                        //Click on the div which lets us select the country.
                        document.querySelector("div[ng-click='chooseCountry()']").click();
                    });

                    await page.type("input[type='search'][ng-model='search.query']", this.m_country_code);

                    await page.evaluate((country_code, country_code_non_existent) =>
                    {
                        //Look whether we have the right option.
                        let remaining_countries = document.querySelectorAll("a[ng-click='$close(country)']");

                        if(remaining_countries.length === 0)
                        {
                            throw new Error(country_code_non_existent);
                        }

                        for(let j = 0; remaining_countries.length; ++j)
                        {
                            if(remaining_countries[j].querySelector("span[ng-bind='country.code']").textContent === country_code)
                            {
                                remaining_countries[j].querySelector("span[ng-bind='country.code']").click();
                                break;
                            }

                            throw new Error(country_code_non_existent);
                        }
                    }, this.m_country_code, Messages.country_code_non_existent());

                    //Enter the correct number.
                    await page.type("input[name='phone_number']", this.m_tel_number);

                    //Submit the login form.
                    await page.evaluate(() =>
                    {
                        document.querySelector("a[ng-click='sendCode()']").click();

                        //Confirm that the number is correct.
                        document.querySelector("button[ng-click='$close(data)']").click();
                    });

                    //Let the new web page load. Otherwise, we will get errors.
                    await page.waitForNavigation({waitUntil: "domcontentloaded"});

                    //Ask the user for the received code.
                    //Error here.#####################################################################################################################
                    let proper_msg = await page.evaluate((verification_code_sent_via_app, verification_code_sent_via_sms) =>
                    {
                        if(document.querySelector("p[ng-switch-when='auth.sentCodeTypeApp']") !== null)
                        {
                            return verification_code_sent_via_app;
                        }
                        else if(document.querySelector("p[ng-switch-default='']" !== null))
                        {
                            return verification_code_sent_via_sms;
                        }
                        else
                        {
                            return "Destination of the verification code is not known."
                        }
                    }, Messages.verification_code_sent_via_app(), Messages.verification_code_sent_via_sms());

                    console.log(proper_msg);

                    //##################################################################
                    prompt("stop...");
                    
                    let valid;
                    do
                    {
                        let verification_code = prompt(Messages.ask_for_verification_code());

                        //Enter the verification code.
                        await page.type("input[name='phone_code']", verification_code);
            
                        //Submit the verification code and check the result.
                        valid = await page.evaluate(() =>
                        {
                            //Submit.
                            document.querySelector("a[ng-click='logIn()']").click();

                            if(document.querySelector("label[my-i18n='login_incorrect_sms_code']") === null)
                            {
                                return true;
                            }
                            else
                            {
                                console.log(Messages.verification_code_wrong());
                                return false;
                            }
                        });
                    } while(!valid);

                    //The user may have set up an additional password.
                    let additional_pw = await page.evaluate(() =>
                    {
                        return document.querySelector("input[name='password']") !== null;
                    });

                    if(additional_pw)
                    {
                        //Get the password hint. It may be empty.
                        let pw_hint = await page.evaluate(() =>
                        {
                            let temp = document.querySelector("p[class='login_form_hint']");

                            if(temp !== null)
                            {
                                return temp;
                            }
                            else
                            {
                                return "";
                            }
                        });

                        do
                        {
                            let pw = prompt(Messages.additional_pw(pw_hint));

                            await page.type("input[name='password']", pw);
                        } while(await page.evaluate(() =>
                        {
                            return document.querySelector("label[my-i18n='login_incorrect_password']" === null)
                        }));
                    }

                    //Successful login.
                    console.log(Messages.successful_login());
                }

                //Save the cookies.
                this.save_cookies(page);
            }
            catch(e)
            {
                console.log("An error occured during the login.");
                console.log(e);
                process.exit();
            }
        })();
    }

    /**
     * @brief Saves the cookies of the current user to a file.
     * @param[in] page {Page} A page from puppeteer whose cookies shall be saved.
     */
    save_cookies(page)
    {
        (async () =>
        {
            try
            {
                let cookies = String(await page.cookies());
    
                fs.writeFileSync(Constants.file_cookies(`${this.m_country_code}${this.m_tel_number}`), cookies);
            }
            catch(e)
            {
                console.log("An error occured while saving the cookies.")
                process.exit();
            }
        })();
    }
}

module.exports = TelegramUser;
