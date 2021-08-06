import Wizard               from "./wizard.js"
import UserCredentialsPage  from "./user-credentials-page.js"
import UserAddressPage      from "./user-address-page.js"
import UserDetailsPage      from "./user-details-page.js"
import User from "./user.js"

class UserSignupWizard  {
    constructor() {
    this.wizard = new Wizard({},
        [new UserCredentialsPage(),
        new UserAddressPage(),
        new UserDetailsPage()])
    }

    open(cb) {
        var _this = this
        this.wizard.open(function(data) {
            console.log(`wizard complete with input: ${JSON.stringify(data)}`)
            _this.sendSignupRequest(data, cb)
        })
    }
    

    sendSignupRequest(data, cb) {
        console.log(`${this} is sending create user with payload: ${JSON.stringify(data)} `)
        $.ajax({
            url : '/user/create',
            method: 'POST',
            data  : JSON.stringify(data),
            contentType: 'application/json',
            success : function(response) {
                console.log(`received signup response: ${JSON.stringify(response)} `)
                if (response.status == 200) {
                    var newUser = new User(response['data'])
                    cb.call(null, newUser)
                } else {
                    openWarningDialog('signup error', response['message'])
                }
            }
        })
    }

}

export default UserSignupWizard