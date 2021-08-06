import Address from "./address.js"

var ADDRESSGROUP_NAME = 'address-group'
/**
 * An address group may have zero or more addresses all belonging
 * to the same user/owner.
 */
class AddressGroup {
    /**
     * create an AddressGroup from given dictionary.
     * The dictionary must contain following keys
     *    owner     -- name of the user whose address are in this group
     *    addresses -- an array of addresses that can be empty
     * A group is displayed as a series of radio buttons. The radio button
     * shows an address name. A tooltip text on each button shows the 
     * details of the corresponding address.
     * 
     * @param {*} data a dictionary
     */
    constructor(data) {
        this.group = []
        this.init(data)
        // these div elements are remembered after the group has been rendered
        // for the first time. They do not represent 'real state' of the group.
        // But they are rembered for ease of refreshing the display when a new
        // address is created 
        this.$choices = null
    }

    /**
     * Initializes this group.
     * This dictionary contains the {owner, array(address) }
     * @param {array} data an array of dictionary. Each element will be 
     * used to construct an address.
     */
    init(data) {
        //assertKeys(data, ['owner', 'addresses'])
        this.owner = data['owner']
        var addrs  = data['addresses'] || []
        for (var i = 0; i < addrs.length; i++) {
            var addr = new Address(addrs[i])
            this.addAddress(addr)
        }
    }
    /**
     * converts this group to a dictionary for use in a template
     * i.e. the states that are being rendered.
     * 
     * @returns a dictionary with  
     *  'group_name' : string becuase all buttons in a radio group must share
     *                 the same name
     *  'addresses'  : array of Address objects
     */
    toDict() {
        return {
            'group_name': ADDRESSGROUP_NAME,
            'addresses' : this.group
        }
    }

    /**
     * adds the address at the beginning or end of the array of items in this group.
     * The first address in the group is always checked. When a new address is
     * add
     * @param {Address} addr an address object to be added 
     * @param {boolean} prepend true if the address is added in the fron to the group.
     * Defaults to false.
     */
    addAddress(addr, prepend) {
        console.log(`addAddress ${this.group.length}`)
        if (prepend) {
            this.group.unshift(addr)
        } else {
            this.group.push (addr)
        }
    }
    /**
     * renders each address as a radio button. All buttons belong to the same
     * Radio Group. 
     * The tooltip on the buttons will show the details of the address
     * @param {jQueryElement} $div the container for the radio buttons
     */
    render($div) {
        var _this = this
        this.markCheckedAt(0) // the first address is checked
        loadTemplate($div, 'templates/address-group.mustache', this.toDict(), 
        function() {
            _this.$choices = $($div, '#address-choices')
            var $addAddressButton = $e($div, '#add-new-address')
            $addAddressButton.on('click', function() {
                //console.log(`[${$(this).attr('id')}] clicked`)
                // only the owner of the new address and its parent group is set. 
                // Rest will be set in the opened dialog itself. 
                Address.openCreateDialog(_this, {'owner':_this.owner})
            })
        })
    }

    /**
     * Finds the address by given label
     * @param {String} label 
     * @returns an Address object or null
     */
    findAddressByLabel(label) {
        //console.log(`findAddressByLabel ${label} in ${this.group.length} addresses`)
        for (var i = 0; i < this.group.length; i++) {
            var addr = this.group[i]
            console.log(`{i} ${addr.name}`)
            if (addr.name == label) {
                //console.log(`return ${JSON.stringify(addr)}`)
                return addr
            }
        }
    }
    /** 
    * refresh the view with the remembered 'real estate'
    */
    refreshDisplay() {
        this.render(this.$choices)
    }

    /**
     * marks the address at given index checked.
     * Rest of the addresses are unchecked.
     * 
     * @param {int} idx the index of the address being checked
     */
    markCheckedAt(idx) {
        for (var i = 0; i < this.group.length; i++) {
            var addr = this.group[i]
            addr.checked = i == idx ? 'checked' : ''
        }
    }

    getSelectedAddress() {
        // next to the selected address appears the label
        var selector = `input[name=${ADDRESSGROUP_NAME}]:checked`
        var $selected = $(selector).first()
        var id = $selected.attr('id')
        //console.log(`${selector} selected ${$selected.length} element with id=[${id}]`)
        //var $label = $selected.next('label').first()
        var selected_address_label = id
        //console.log(`selected label ${$label.length} element. text=[${selected_address_label}]`)
        return this.findAddressByLabel(selected_address_label)
    }
}

export default AddressGroup