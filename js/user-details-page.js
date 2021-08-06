import WizardPage from "./wizardpage.js";

class UserDetailsPage extends WizardPage {
    constructor(data) {
        super({
            'section': 'profile',
            'titile':'User Detals',     
            'template':'templates/user-details.mustache'})
    }

    validate() {
        super.validate($form)
        // TODO: validate user-address form
        return true
    }

    collect() {
        var result = super.collect(['image', 'dob'])
        return result  
    }
}

export default UserDetailsPage