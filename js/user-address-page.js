import WizardPage from "./wizardpage.js";

class UserAddressPage extends WizardPage {
    constructor(data) {
        super({
            'section': 'address',
            'titile' : 'User Address',    
            'template':'templates/user-address.mustache'})
    }

    validate() {
        super.validate()
        // TODO: validate user-address form
        return true
    }

    collect() {
        var result = super.collect(['line1', 'line2', 'city', 'state', 'pin', 'phone'])
        var direction   = this.$dialog.find('#direction').text()
        result['direction'] = direction
        return result
    }
}

export default UserAddressPage