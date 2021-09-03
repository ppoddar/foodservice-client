import FoodService from './foodservice.js'
import ItemEdit   from './item-edit.js'
import ItemFilter from './item-filter.js'

/*
 * A dialog has following phase
 *  - presnet a form to the user
 *  - accept user input and validate 
 *  - on end of interaction, when user presses OK, send server request
 *  - render async response from the server to the user
 */
class ItemView {
    open($div) {
        this.renderForm()
        .then(($form)=>{
            console.log(`then openDialog with form ${$form.attr('id')}`)
            console.log($form.html())
            var opts = {
                buttons: [{
                    "text": "OK",
                    "click": function() {
                        console.log(`click OK on dialog`)
                        if (this.validate($form)) {
                            var payload = this.collectInput($form)
                            console.log(`sendServerRequest with paylaod ${JSON.stringify(payload)}`)
                            sendServerRequest(payload, renderOutput.bind(this, $div))
                        }
                    }
                }]
            }
            $form.dialog(opts)
        })
    }

    /**
     * Render a form using a template and data
     * 
     * @param {*} template 
     * @param {*} data 
     * @returns a promis resolved to a form
     */
    renderForm() {
        var $form = $('<div>')
        $form.attr('id', 'item-view')
        var template_name = 'templates/item-view.mustache'
        var data = {}
        console.log(`render form [${$form.attr('id')}] with [${template_name}] with data [${JSON.stringify(data)}]`)
        return new Promise((resolve, reject) => {
            $.get(template_name, function(template) {
                var html = Mustache.render(template, data)
                $form.html(html)
                return resolve($form)
            }
        )
    })}

    /*
     * renders all items in the given $div.
     *  -- Creates a HTML table in the given div. 
     *  -- Fetches all items via Ajax call
     *  -- renders all fetched items in a DataTable on the HTML table element 
     */
    renderOutput($div) {
        // load fill view with table and filter buttons
        loadTemplate($div, 'templates/item-view.mustache', {}, function(){
            FoodService.instance()
            .then((service) => {
                var menu   = service.menu
                loadTemplate($div.find('#item-table'), 
                    'templates/item-datatable.mustache', 
                    {'items':menu.sortedItems()}, 
                    function($div) {
                        var opts = {
                            dom: 't<"bottom"i><"clear">',
                            scrollY: '200px',
                            scrollCollapse:true,
                            fixedHeader: {
                                header:true,
                                footer:true
                            }
                        }
                        $div.find('.edit-button').on('click', function(){
                            var sku = $(this).parent().siblings('#item-sku').text()
                            var item = menu.findItemBySKU(sku)
                            new ItemEdit().open(item, $div.find('#item-table'))
                        })
                        $div.dataTable(opts)

                    })
    
                $div.find('#filter-items').on('click', function() {
                    console.log('filter items and show in the datatable')
                    new ItemFilter().open()
                })
            })
        })

    }

}
export default ItemView