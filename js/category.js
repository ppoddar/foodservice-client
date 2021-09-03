/**
 * a client-side model object of a category of food item
 */
 

class Category {
    
    /**
     * a category has id and label. The label is used for visual repreentaion.
     * 
     * @param {string} id identifier of the category 
     * @param {string} label label of the category 
     * @param {string} licon icon of the category  (optional)
     */
    constructor(data) {
        this.id    = data['id']
        this.label = 'label' in data ? data['label'] : this.id
        this.icon  = 'icon'  in data ? data['icon'] :  ''
        this.items = []
    }

    addItem(item) {
        this.items.push(item)
        //console.log(`add ${item} to  ${this}`)
    }
    /**
     * render this category as an <li> element from a template.
     * Populate the elemt.
     * Append it to given $ul
     * 
     * @param {*} $ul a list element
     */
    render($div) {
        var $category = $('<div>')
        $category.attr('id', `category-${this.name}-created`)
        var self = this
        var template = 'templates/category.html'
        var anchorId = 'category'
        $category.load(`${template} #${anchorId}` , function(){
            //console.log(`element id inside callback fn of $(this) is [${$(this).attr('id')}]`)
            var $loaded = $category.find('#'+anchorId).first()
            $loaded.attr('id', `category-${self.name}-loaded`)
            var $ctl    = $(this).find('#control').first()
            var $label  = $(this).find('#label').first() 
            var $icon   = $(this).find('#icon').first() 
            $ctl.text(ICON_EXPAND_MORE)  // material icons by name
            $label.text(self.name)
            $icon.text(self.icon)         // material icons by name
            $loaded.children().each(function(idx) {
                var id = $(this).attr('id')
                //console.log(`changing id of ${id}`)
                $(this).attr('id', `${$loaded.attr('id')}-${id}`)
            })
            var $items = $('<div>')
            $items.attr('id', `category-${self.name}-item-list`)
            // add the items inside the template div loaded
            console.log(`loaded div id is [${$loaded.attr('id')}]`)
            $loaded.append($items)
            console.log(`rendering ${self.items.length} items to category ${self.label}`)
            for (var i = 0; i < self.items.length; i++) {
                var item = self.items[i]
                item.render($items)  
            }
            $(this).on('click', function(e)  {
                var $ctl    = $(this).find('#control').first()
                var $items = $(this).find('#item-list')
                //var $all = $(this).find().not($(this).children()) // except immediate children
                if ($ctl.text() == ICON_EXPAND_MORE) {
                    $items.show()
                    $ctl.text(ICON_EXPAND_LESS)
                } else {
                    $items.hide()
                    $ctl.text(ICON_EXPAND_MORE)
                }
                return false
            })
        })

        $div.append($category)
    }


    

    toString() {
        return `Category: ${this.id} [${this.label}]` 
    }

}

export default Category