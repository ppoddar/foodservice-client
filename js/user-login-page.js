/*
 * A dialog presents a form to accept username and password.
 * Validates the input.
 */
class UserLoginPage {
    /**
     * Opens a dialog. The 'OK' function in the dialog will validate
     * the input, and then call the given callback with validated input.
     * 
     * The form also allows to open a Signup dialog or go to other workflows
     * if credentials are forgotten
     */
    open(cb) {
        var TEMPLATE = 'templates/login-page.mustache'
        var _this     = this
        var _callback = cb
        var opts = {
            autoOpen: true,
            modal: true,
            title: 'Login',
            width: 500,
            height: 400,
            buttons: [
                {'text': 'Login',
                 'click': function() {
                    if (_this.validate($(this))) {
                        $(this).closest('.ui-dialog-content').dialog('close')
                        _callback.call(null, _this.collect($(this)))
                    }
                 }}
            ]
        }
        openDialog(TEMPLATE, {}, opts)
    }

    /**
     * collects the input field values from a form. 
     * @param {*} $form 
     * @returns a dictionary
     */
     collect($form) {
        var result = {}
        result['username'] = $form.find('#user-name').val()
        result['password'] = $form.find('#user-password').val()
        return result
    }
    /**
     * validates the input values in the given form.
     * If not valid, prints the error in the form itself
     * @param {*} $form 
     * @returns true if valid, false otherwise
     */
    validate($form ) {
        var name = $form.find('#user-name').val()
        var pwd  = $form.find('#user-password').val()
        //console.log(`form name=[${name}] use_email_as_name=${use_email_as_name}`)
        var $error = $form.find('#error_message')
        //console.log(`found ${$error.length}`)
        if (!name) {
            //console.log(`name (or email) must be filled up`)
            $error.text(`user name must be filled up`)
            return false
        }
        if (USER_NAME_RESERVED.includes(name) && !use_email_as_name) {
            $error.text(`can not use [${name}] as user name. Choose a different name`)
            return false
        }
        if (!pwd) {
            $error.text(`password can not be empty`)
            return false
        }
        return true
    }
} 

export default UserLoginPage