import WizardPage from "./wizardpage.js"
const USER_NAME_RESERVED = ['guest', 'admin']

/*
 * A dialog presents a form to accept username and password.
 * Validates the input.
 */
class UserCredentialsPage extends WizardPage {
    constructor(data) {
        super({'titile':'User credentials', 
               'template':'templates/user-credentials.mustache'})
    }
    /**
     * collects the input field values from a form. 
     * @param {*} $form 
     * @returns a dictionary
     */
    collect() {
        
        var name  = this.$dialog.find('#user-name').val()
        var pwd   = this.$dialog.find('#user-password').val()
        var email = this.$dialog.find('#user-email').val()
        var use_email_as_name = this.$dialog.find('#use-email-as-name').is(':checked')
        
        var result = {}
        result['username'] = use_email_as_name ? email : name
        result['password'] = pwd
        result['email']    = email
        return result
    }
    /**
     * validates the input values in the given form.
     * If not valid, prints the error in the form itself
     * @param {*} $form 
     * @returns true if valid, false otherwise
     */
    validate( ) {
        super.validate()
        var name = this.$dialog.find('#user-name').val()
        var pwd  = this.$dialog.find('#user-password').val()
        var pwd2 = this.$dialog.find('#user-password-verify').val()
        var email = this.$dialog.find('#user-password-email').val()
        var use_email_as_name = this.$dialog.find('#use-email-as-name').is(':checked')
        //console.log(`form name=[${name}] use_email_as_name=${use_email_as_name}`)
        var $error = $e(this.$dialog,'#error-message')
        //console.log(`found ${$error.length}`)
        if (name == undefined && !use_email_as_name) {
            console.error(`name (or email) must be filled up`)
            $error.text(`name (or email) must be filled up`)
            return false
        }
        if (USER_NAME_RESERVED.includes(name) && !use_email_as_name) {
            var msg = `can not use [${name}] as user name. Choose a different name`
            console.error(msg)
            $error.text(msg)
            return false
        }
        if (!pwd) {
            console.error('password can not be empty')
            $error.text(`password can not be empty`)
            return false
        }
        if (pwd != pwd2) {
            console.error(`passwords do not match`)
            $error.text(`passwords do not match`)
            return false
        }
             
        return true
    }
} 

export default UserCredentialsPage


/*
/*
        var promise = new Promise((resolve, reject) => {
            $.ajax({
                url: `/user/find/${name}`,
                timeout: 30000,
                success: (response) => {
                    console.log(`response ${JSON.stringify(response)}`)
                    resolve(response);
                },
                error: (response) => {
                    console.log(`error response ${JSON.stringify(response)}`)
                    reject(response);
                }
            })
        }).then(function(response) {
            //console.log(`then response resolved ${JSON.stringify(user)}`)
            if (response.status == 200) {
                $error.text(`user [${name}] already exists. choose a different name or use email as your user name`)
                return false
            }  
        })
        */