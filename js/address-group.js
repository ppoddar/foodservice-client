import Address from "./address.js"

/**
 * An address group may have zero or more addresses all belonging
 * to the same user/owner.
 * The address group is rendered as a Radio Group. Each button in 
 * the group shows the label of the address. The tooltip on the
 * button shows the address in detail.
 * User selects an address or creates a new address, that becomes
 * member of the group.
 * The first button on the group is checked by default.
 */

 var ADDRESSGROUP_NAME = 'address-group'
 class AddressGroup {
    /**
     * create an AddressGroup from given dictionary.
     * The dictionary must contain following keys
     *    owner     -- name of the user whose address are in this group
     *    addresses -- an array of addresses that can be empty
     * A group is displayed as a series of radio buttons. The radio button
     * shows an address label. A tooltip text on each button shows the 
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
        this.owner = data['owner']
        var addrs  = data['addresses'] || []
        for (var i = 0; i < addrs.length; i++) {
            var addr = new Address(addrs[i])
            this.addAddress(addr)
        }
    }
    /**
     * converts this group to a dictionary for use in a template
     * i.e. the states that are to be rendered.
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
     * added it is prepended, otherwise addresses are appended.
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
                // only the owner of the new address is set. 
                // Properties of the address will be set in the opened dialog itself. 
                Address.openCreateDialog(_this, {'owner':_this.owner}, function(addr) {
                    // prepend the new address and refresh view
                    _this.addAddress(addr, true)
                    _this.refreshDisplay()
                })
            })
        })
    }

    /**
     * Finds the address by given label
     * @param {String} label 
     * @returns an Address object
     * @exception if the address can not be found
     */
    findAddressByLabel(label) {
        //console.log(`findAddressByLabel ${label} in ${this.group.length} addresses`)
        for (var i = 0; i < this.group.length; i++) {
            var addr = this.group[i]
            //console.log(`{i} ${addr.name}`)
            if (addr.name == label) {
                //console.log(`return ${JSON.stringify(addr)}`)
                return addr
            }
        }
        throw `no address found by label ${label} in this group`
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

    /**
     * seraches through the addresses of this group to find the address
     * with the label of the checked radio button.
     * @returns an address object
     */
    getSelectedAddress() {
        // next to the selected address appears the label
        var selector = `input[name=${ADDRESSGROUP_NAME}]:checked`
        var $selected = $(selector).first()
        if ($selected.length == 0) {
            console.error(`CSS selector ${selector} found no checked button in the radio group.`)
        }
        //console.log(`${selector} selected ${$selected.length} element with id=[${id}]`)
        // NOTE: assumption is that each radio button is sam eas the label of the address
        // this assimption is fulfilled by the Mustache tempalte
        var selected_address_label = $selected.attr('id')
        //console.log(`selected label ${$label.length} element. text=[${selected_address_label}]`)
        return this.findAddressByLabel(selected_address_label)
    }
}

export default AddressGroup