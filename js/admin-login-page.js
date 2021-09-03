/*
 * A dialog presents a form to accept username and password
 * for an administrator.
 * 
 * Validates the input. 
 */
class AdminLoginPage {
    /**
     * Opens a dialog. The 'OK' function in the dialog will validate
     * the input, and then call the given callback with validated input.
     * @param {function (username, password)} cb
     * @param {function ()} optional close/cancel callback
     * By defualt all open dialogs, imcluding the parent, will be closed
     */
    open(cb,closeFn) {
        var _this     = this
        var _callback = cb
        var opts = {
            autoOpen: true,
            modal: true,
            title: 'Login',
            width: 500,
            height: 300,
            buttons: [
                // login button is clicked
                {'text': 'Login',
                 'click': function() {
                     //console.log('login clicked')
                    if (_this.validate($(this))) {
                        $(this).dialog('destroy')
                        if (typeof(_callback) == 'function') {
                            var payload = _this.collect($(this))
                            _callback.call(null, payload)
                        }
                    }
                 }}
            ],
            // when the dialog is closed/cancelled, all open dialogs
            // including the parent dialogs will be close by default
            // otherwise the caller must supply an alternative 'close' 
            // function
            close: (event,ui) => {
                //console.error('close login dialog')
                if (typeof(closeFn) == 'function') {
                    closeFn.call(null)
                    //console.error('login dialog calling close function supplied in opts')
                } else {
                    $(".ui-dialog-titlebar-close").trigger('click');
                }
            }
        }
        openDialog('templates/admin-login-page.mustache', 
            {},    // data to render the login form
            opts)  // options to control the dialog behavior
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
        console.log(`username=[${name}]`)
        if (!name || name == undefined || name.trim() == '') {
            var $error = $e($form, '#error')
            this.showError($error, `usr name must be filled up`)
            return false
        }
        if (!pwd) {
            $error.text(`password can not be empty`)
            return false
        }
        return true
    }

    showError($error, message) {
        var $icon = $('<span>')
        $icon.addClass('material-icons')
        $icon.css('color', 'red')
        $icon.css('font-size', '16pt')
        $icon.text('error')
        var $message = $('<span>')
        $message.css('margin-left', '24px')
        $message.css('color', 'red')
        $message.text(message)
        $error.append($icon, $message)

    }

    clearError() {
        var $error = $e($form, '#error')
        $error.empty()

    }
} 

export default AdminLoginPage