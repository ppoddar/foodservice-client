var KEY_ADDRESS ='address'
var SERVER_URL = 'http://localhost:8000'
/**
 * An address is a view controller. It renders as a radio button with a tooltip text.
 * It can open a dialog to create new address.
 */
class Address {
    constructor(data) {
        assertKeys(data, ['id', 'owner', 'name', 'line1', 'city', 'pin'])
        this.init(data)
    }
    init(data) {
        if (data) {
            this.id     = data['id']
            this.owner  = data['owner']
            this.name   = data['name']
            this.line1  = data['line1']
            this.line2  = data['line2']
            this.city   = data['city']
            this.state  = data['state']
            this.pin    = data['pin']
            this.phone  = data['phone']
            this.direction = data['direction']
        }
    }

    /**
     * Saves the id of this address on session storage
     */
    save() {
        window.sessionStorage.setItem(KEY_ADDRESS, this.id)
    }

    /**
     * gets the id of an address from sessin storage
     */
    static fetch() {
        var id = window.sessionStorage.getItem(KEY_ADDRESS)
        if (id) return id
        throw `Address key [${KEY_ADDRESS}] not in session`
    }

    
    /**
     * converts this address to an address for rendering
     * @returns a dictionary
     */
    toDict() {
        return {
            'name'  : this.name,
            'line1' : this.line1,
            'line2' : this.line2,
            'city'  : this.city,
            'state' : this.state,
            'pin'   : this.pin,
            'phone'   : this.phone,
            'direction'   : this.direction
        }
    }

    /**
     * Opens a dialog to create a new address.
     * @param {AddressGroup} the group on behalf of which an addrrs is being created.
     * The callback function provided will be called on this group with new address
     * as its argument
     * @param {Dictionary} this dictionary is extended with all collected data by
     * the dialog
     * 
     */
    static openCreateDialog(group, data, cb) {
        // this function will be called when dialog is OK'ed
        var createAddress = function() {
            var formInput = {
                'label' : $(this).find('#address-label').val(),
                'line1' : $(this).find('#address-line1').val(),
                'line2' : $(this).find('#address-line2').val(),
                'city'  : $(this).find('#address-city').val(),
                'state' : $(this).find('#address-state').val(),
                'pin'   : $(this).find('#address-pin').val(),
                'phone' : $(this).find('#address-phone').val(),
                'direction' : $(this).find('#address-direction').val()
            }
            try {
                assertKeys(formInput, ['name', 'line1', 'city', 'pin'], true) // the owner has been added before
            } catch (err) {
                console.log(err)
                $(this).find('#error-message').text(err)
                return
            }
            var payload = Object.assign(data, formInput)
            var url = `${SERVER_URL}/user/create/address`
            console.log(`openCreateDialog() POST ${url} payload:${JSON.stringify(payload)}`)
            $.ajax({
                url: url,
                method: 'POST',
                data: JSON.stringify(payload),
                contentType: 'applicaton/json',
                success: function(response) {
                    console.log(`${url} response ${JSON.stringify(response)}`)
                    // initialize the address from server response which is an array of addresses
                    if (response['status'] != 200) {
                        openWarningDialog('Error new address', response['message'])
                    } else {
                        var addr = new Address(response['data'])
                        if (typeof(cb) == 'function') {
                            cb.call(group, addr)
                        }
                        
                    }
                }
            }) 
            $(this).closest('.ui-dialog-content').dialog('close'); 
        }

        var opts = {
            autoOpen: true,
            modal: true,
            title: 'Create new address',
            width:  600,
            height: 400,
            buttons: [{
                'text':'Create Address',
                'click': createAddress
            }]
        }
        // the dialog form needs to input to render a template
        openDialog('templates/address-create.mustache', {}, opts) 
    }

    toString() {
        return `Address [${this.name}:${this.owner}]`
    }
}


export default Address