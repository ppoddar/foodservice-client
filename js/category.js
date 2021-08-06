/**
 * a client-side model object of a category of food item
 */
 const DEFAULT_CATEGORY = "Other"
 const DEFAULT_ICON     = "restaurant_menu"
 const NAME_TO_LABEL = {
    'chicken': 'Chicken',
    'fish'   : 'Fish',
    'mutton' : 'Mutton',
    'veg'    : 'Vegetarian',
    'side'   : 'Sides',
}
const NAME_TO_ICON = {}
const ICON_EXPAND_MORE = 'expand_more'
const ICON_EXPAND_LESS = 'expand_less'
class Category {
    static ORDER = ['chicken', 'fish', 'mutton', 'veg', 'side']
    static getLabelForName(name) {
        return NAME_TO_LABEL[name]
    }
    /**
     * a category has identifer name and label. The label is used for visual repreentaion.
     * A fixed set of mapping exists from name->label.
     * 
     * @param {name} identifier of the category 
     */
    constructor(name) {
        this.name  = name
        this.label = name in NAME_TO_LABEL ? NAME_TO_LABEL[name] : DEFAULT_CATEGORY
        this.icon  = name in NAME_TO_ICON  ? NAME_TO_ICON[name] : DEFAULT_ICON
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
        return `Category: ${this.label} [${this.name}] (${this.items.length} items)` 
    }

}

export default Category