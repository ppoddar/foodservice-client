/**
 * User represnts an application user.
 * It is a view controller. It renders on the browser reflecting its state.
 * It also controls the user function such as login, logout to the server.
 * It saves its state on local storage.
 * It acts as a singleton.
 * 
 * 
 */
import UserLoginPage        from "./user-login-page.js"
import UserSignupWizard     from "./user-signup-wizard.js"
import AddressGroup         from "./address-group.js"
import Address              from "./address.js"
import UserProfile          from "./user-profile.js"

const KEY_USER = 'key-user'
var singleton

class User {
    /**
     * gets the singlton instance of an user.
     * If the singleton is not initailzied, tries to read from the local storage.
     * If no user is available in the local storage, then a 'guest' user is
     * created. 
     * 
     * @returns a user
     */
    static instance() {
        if (!singleton) {
            singleton = User.fromLocalStorage() 
                || new User({'username': 'guest', 'image':'no-user.png'})
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
    constructor(data, passwordEncoded) {
        this.init(data, passwordEncoded)
    }
    /**
     * initializes from given data in JSON representaion
     * The password is saved inside this class base64 encoding.
     * Besides first_name, last_name etc. can be present.
     * Only usrname is mandatory.
     * 
     * @param {Dictionary}  data carries {username,password}
     * where username identifier for the user
     * password is optional. can be in clear-text or Base64 encoded
     * @param {boolean} passwordEncoded if true password is already encoded.
     * Otherwise, it would be encoded. Defauls to false
     * 
     */
    init(data, passwordEncoded) {
        assertKeys(data, ['username'])
        this.username  = data['username']
        if ('password' in data) {
            this.password   = data['password']
            if (!passwordEncoded) this.password = utf8_to_b64(this.password) 
        } 
        
        this.first_name = ('first_name' in data) ? data['first_name'] : this.username
        this.last_name  = ('last_name' in data)  ? data['last_name']:  ''
        this.email      = ('email' in data)      ? data['email'] : ''
        this.dob        = ('dob' in data)        ? data['dob'] :  ''
        this.address    = ('address' in data)    ? new Address(data['address']) : {}
        this.profile    = ('profile' in data)    ? new UserProfile(data['profile']) : {}
        return this
    }

    /**
     * Ensures an user has logged in. Called before performing a server side
     * operation that would required authrozed access such as checking out an
     * order.
     * If the current user has already logged in, then simply calls back the
     * given callback function with current user.
     * Otherwise, if the current user has user name and password sends them
     * to server for login. 
     * If the current user has no password, opens Login Dialog to accept 
     * credentials. The Login Dialog may also start a User signup workflow
     * that will create a new user. If a new user is registered, then the
     * callback is called with new user. 
     * 
     * @param cb a callback function that takes two  arguments: a) an User
     * object and b) a boolean denoting whether a new user is registered 
     * as a result of this call.
     *  
     */
    ensureLogin(cb) {
        if (this.is_loggedin) {
            cb.call(null, this, false)
        }
        var _this = this
        var callback = function(data) {
            _this.sendLoginRequest(data, cb)
        }
        new UserLoginPage().open(callback)
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
        new UserLoginPage().open(function(data) {
            // the data is a dictionary of all  information in the login page
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
            url : '/user/login',
            method: 'POST',
            data  : JSON.stringify({'username':_this.username, 'password':_this.password}),
            contentType: 'application/json',
            success : function(response) {
                console.log(`${_this} received login response: ${JSON.stringify(response)} `)
                if (response.status == 200) {
                    _this.init(response.data)
                    _this.is_loggedin = true
                    cb.call(null, _this)
                } else {
                    openWarningDialog('Login error', response['message'])
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
     * get user from local storage, if any.
     * If does not exist, returns null
     */
    static fromLocalStorage() {
        var str = window.localStorage.getItem(KEY_USER)
        if (str)  {
            var data = JSON.parse(str)
            return new User(data)
        } else {
            return null
        }
    }
    /**
     * saves the current state in local storage
     */
    save() {
        window.localStorage.setItem(KEY_USER, JSON.stringify(this))
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
        var $profile = $e($div,'#user-profile')
        $login.on('click', () => {this.login()})
        $logout.on('click', ()=> {this.logout()})
        $profile.on('click', ()=>{this.showProfile()})

        $login.attr('disabled',  this.is_loggedin)
        $logout.attr('disabled', !this.is_loggedin)
    }

    showProfile() {
        alert('showProfile')
    }
    /**
     * gets addresses from server by ajax.
     * The response is an array of addresses. Create an addressGroup
     * by attaching this user as owner to the group (the same owner should
     * be with every elment with response array).
     * Then calls the callback function with new AddressGroup
     */
    getAddresses(cb) {
        //console.log(`User.getAddresses()`)
        var url = `/user/addresses/${this.username}`
        var _this = this
        $.ajax({
            url: url,
            success: function(response) {
                // construct an AddressGroup from the response of array of addresses
                //console.log(`User.getAddresses() callback with ${JSON.stringify(response)}`)
                var addressGroup = new AddressGroup({
                    'owner'    : _this.username,
                    'addresses': response['data']
                })
                //console.log(`${cb.name}.call()`)
                // calls the callabck (annonymous) function with the AddressGrop as argument
                cb.call(null, addressGroup)
            }
        })
    }

    toString() {
        return `User [${this.username}]`
    }

    /**
     * Registers a new user.
     * A user registration requires several details. These details are 
     * collected via an wizard.
     * 
     * @param {*} cb a callback function that were invoked when the wizard
     * finishes. The callback function will have an user as argument. 
     */
    signup(cb) {
        var _this = this
        console.log(`${this}.signup() wizard open`)
        new UserSignupWizard().open(function(user) {
            user.sendLoginRequest(function(user){
                _this.init(user)
                _this.is_loggedin = true
                cb.call(null, user)
            })
        })
    }

    /**
     * logs in the current user with any dialog based interaction. 
     * If the user is currently logged in, then it is a no-op.
     * Otherwise, if the user has a password, sends the credentials
     * to the server.
     * 
     * login this user and renders
     */
    autologin($div) {
        if (this.is_loggedin) {
            this.render() // update the dropdown
        } else if (this.password) { // send AJAX request with credentials
            var _this = this
            this.sendLoginRequest({'username':this.username, 'password':this.password},
                function(user) {
                    console.log(`autologin callback ${JSON.stringify(user)} `)
                    _this.init(user.toDict())
                    _this.is_loggedin = true
                    _this.render()
                })
            
        } else {
            //console.log(`no credentials [${this}] for not autologin`)
            //this.render() // will set the dropdown menu action handlers
            return
        }
        
    }

}

export default User


