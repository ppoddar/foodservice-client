/**
 * User represnts an application user.
 * It is a view controller. It renders on the browser reflecting its state.
 * It also controls the user function such as login, logout to the server.
 * It saves its state on local storage.
 * It acts as a singleton.
 * 
 * 
 */
import AdminLoginPage        from "./admin-login-page.js"

var SERVER_URL = 'http://localhost:8000'

class Admin {
    static instance() {
        if (singleton) {
            return singleton
        } else {
            console.error('creaiting new admin')
            singleton = new Admin()
            singleton.login()
        }
        return singleton
    }
    /**
     * creates an user. 
     * @param {*} data 
     * @param {boolean} passwordEncoded if true, then password, if any in the data,
     * is assumed to be base 64 encoded. Else the password is assumed to in clear text
     * and would be base 64 encoded.
     */
    init(data) {
        this.username = data['username']
        this.password = data['password']
        this.is_loggedin = false
    }
    
    /**
     * Logs in the user. 
     * Does nothing is user has already logged in.
     * Othwise opens up UserLoginPage dialog. This dialog will login
     * the user. On successful login, the complete information about
     * the user will be returned by the server. The user then will be
     * initialized with all details (such as first and last name, email etc.)
     */
    login() {
        if (this.is_loggedin) {
            console.log(`${this} is already logged in. No need to login again `)
            this.render() // this will update the user drop-down menu
            return
        }
        var _this = this
        new AdminLoginPage().open(function(data) {
            // the callback data is a dictionary of all  information in the login page
            // namely username and clear-text password
            _this.sendLoginRequest(data)
        })
    }
    /**
     * Sends login POST request to server.
     * Marks the user as logged in on successful response
     * Renders the user on succesful reponse.
     * @param {Dictionary} data payload for server request
     * @param {fn} callback with the logged in user as argument
     */
    sendLoginRequest(data, cb) {
        var _this = this
        console.log(`${this} is sending login request with payload: ${JSON.stringify(data)} `)
        $.ajax({
            url : `${SERVER_URL}/user/login`,
            method: 'POST',
            data  : JSON.stringify(data),
            contentType: 'application/json',
            success : function(response) {
                console.log(`${_this} received login response: ${JSON.stringify(response)} `)
                if (response.status == 200) {
                    _this.init(response.data)
                    _this.is_loggedin = true
                    $.cookie('loginStatus', 1)
                    if (typeof(cb) == 'function')
                        cb.call(null, _this)
                } else {
                    // the warning dialog in OK or Close reattempts the login  
                    openWarningDialog('Login error', response['message'], 
                    function() {_this.login()}, 
                    function() {_this.login()})
                }
            }
        })
    }

    /**
     * Logs out this user
     */
    logout() {
        var _this = this
        $.ajax({
            url: '/user/logout',
            method: 'POST',
            success: function(response) {
                this.is_authenticated = false
                _this.render()
            }
        })
    }


    /**
     * renders this user.
     * If guest user, it renders as an clickable image. 
     * On image click, a dropdown menu with actions specific to user status.
     * 
     * @param {HTMLElement} $div the 'real estate' to render this user.
     * 
     */
    render() {
        console.log(`render ${this.username}`)
        var $div = $('#user')
        var $image = $div.find('#user-image')
        $image.attr('src', this.image)

        var $login   = $e($div,'#user-login')
        var $logout  = $e($div,'#user-logout')
        $login.on('click', () => {this.login()})
        $logout.on('click', ()=> {this.logout()})

        $login.attr('disabled',  this.is_loggedin)
        $logout.attr('disabled', !this.is_loggedin)
    }


    toString() {
        return `Admin [${this.username}]`
    }
}

var singleton

export default Admin


