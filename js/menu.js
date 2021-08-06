import Category from "./category.js"
import Item from "./item.js";

class Menu {
    constructor() {
        this.items      = []
        this.categories = {}
        this.recommendations = []
    }

    /**
     * Gets the singleton menu.
     * 
     * Menu is initialized by fetching the items from server
     * via ajax (hence asynchronous), if necessary.
     * 
     * The callabck function is called once server response has been 
     * received.
     * @param {*} cb a callback function where this == this menu.
     * optional.
     */
    static instance(cb) {
        if (singleton) {
            return singleton
        }
        console.log(`initilaizing menu from server...`)
        $.ajax({
            url: `item/get_all`,
            success: function(response) {
                if (response.status == 200) {
                    console.log(`received response from ajax with ${response['data'].length} items`)
                    singleton = new Menu()
                    singleton.init(response['data'])
                    singleton.getAllRecommendation()
                    cb.call(null, singleton)
                } else {
                    openErrorDialog('Initalization error', response.message)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    }

    init(items) {
        this.items = items
        this.categories = this.categorize(this.items)
    }

    /**
     * renders the entire menu.
     * Menu has two main sections. 
     * 1. A header bar that houses the category-wise
     * navigation and search button
     * 2. A list of items.
     * 
     * @param {HTMLDiveElement} $div a div with both the parts 
     */
    render($div) {
        this.renderCategories($e($div, '#menu-header'))
        this.renderItems($e($div, '#menu-items'))
        
    }

    renderCategories($div) {
        this.buildCategoryOptions($div)
    }

    /**
     * renders all the menu items in given div.
     * The menu items are rendered in pre-defined, categoried order.
     * An item may be in multiple categories, but is not shown repeatedly
     * 
     * @param $div a conatainer element. The items rendered
     * will be added to the container.
     */
    renderItems($div) {
        var items = this.sortedItems()
        for (var i = 0; i < items.length; i++) {
            var item = items[i]
            item.render($div)
        }
    }
    /**
     * reorders the item in a fixed order of category 
     */
    sortedItems() {
        var shown = []
        var result = []
        for (var i = 0; i < Category.ORDER.length; i++) {
            var c = Category.ORDER[i]
            if (c in this.categories) {
                var category = this.categories[c]
                var items = category.items
                for (var j = 0; j < items.length; j++) {
                    var item = items[j]
                    if (shown.includes(item.sku)) continue
                    result.push(item)
                    shown.push(item.sku)
                }
            }
        }
        return result
    }

    /**
     * filters the items by category.
     * The list of items are sorted by category names a sappear in Category.ORDER
     * An item may appear in multiple categories but an item appears only once
     * in the resultant array
     * 
     * 
     * @param {*} category_name a category name. null implies no filtering.
     * @returns an array of filtered items
     */
    filterByCategory(category_name) {
        var result = []
        var candidates = []
        var selected = []
        if (category_name) {
            var candidates = this.categories[category_name].items
            for (var i = 0; i < candidates.length; i++) {
                var item = candidates[i]
                if (selected.includes(item.sku)) continue;
                if (item.categories.includes(category_name)) {
                    result.push(item)
                    selected.push(item.sku)
                }
            }
            return result
        } else {
            for (var j = 0; j < Category.ORDER.length; j++) {
                var candidates = this.categories[Category.ORDER[j]].items
                for (var i = 0; i < candidates.length; i++) {
                    var item = candidates[i]
                    if (selected.includes(item.sku)) continue;
                    result.push(item)
                    selected.push(item.sku)
                }
            }
        }
        return result
    }

    /**
     * 
     * @param Categorize the given items
     * @returns a map of category name -> Category
     */
    categorize(items) {
        var categories = {} // map name -> Category
        for (var i = 0; i < items.length; i++) {
            let item = new Item(items[i])
            //console.log(`${item} in categories ${item.categories}` )
            for (var j = 0; j < item.categories.length; j++) {
                let c = item.categories[j]
                var category
                if (!(c in categories)) {
                    category = new Category(c)
                    categories[c] = category
                } else {
                    category = categories[c]
                }
                category.addItem(item)
            }
        }
        return categories
    }

    /**
     * List of other items' SKU that are recommended with the item
     * with given sku.
     * can be empty
     */
     getRecommendation(sku) {
         console.log(`getRecommendation(${sku}) in ${this.recommendations.length} `)
        for (var i = 0; i < this.recommendations.length; i++) {
            var reco = this.recommendations[i]
            console.log(`look for reco ${JSON.stringify(reco)}`)
            if (reco.sku == sku) {
                console.log(`matched! others: ${JSON.stringify(reco.others)}`)
                var others = reco.others
                if (!Array.isArray(others)) {
                    others = others.split(' ')
                }
                console.log(`getRecommendation returns ${JSON.stringify(others)}`)
                return others
            }
        }
    }


    getAllRecommendation(cb) {
        var self = this
        $.ajax({
            url: `item/get_all/recommendation`,
            success: function(response) {
                console.log(`response recommendations ${JSON.stringify(response)}`)
                self.recommendations = response['data']
                if (cb) cb.call(self)
            }
        })
    }

    findItemBySKU(sku) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].sku == sku) return this.items[i]
        }
        throw `no item found with sku ${sku}`
    }

    /*
     * Builds drop-down elements to select category 
     */
    buildCategoryOptions($div) {
        var $dropdown = $e($div, '#category-selection-dropdown')
        var $all = this.buildCategoryOption(null, 'All')
        $dropdown.append($all)
        for (var i = 0; i < Category.ORDER.length; i++) {
            var category_name = Category.ORDER[i]
            var $option = this.buildCategoryOption(category_name, Category.getLabelForName(category_name))
            $dropdown.append($option)
        }
    }

    /*
     * A dropdown option selects items from a particular category.
     * The category lable is updated.
     * @param name category name. Null implies no filtering i.e. all items. 
     * @param label a label to show. 
     */
    buildCategoryOption(name, label) {
        //console.log(`buildCategoryOption ${label}`)
        var $button = $('<button>')
        $button.text(label)
        var _this = this
        $button.on('click', function() {
            _this.selectByCategory.apply(_this, [name])
            $('#category-option').text(label)
        })
        return $button
    }
/*
 * selects items of given category and renders the items on $menu-items element
 */    
 selectByCategory(category) {
    //console.log(`onCategorySelect ${category}`)
    var $menuItems = $('#menu-items')
    $menuItems.empty()
    this.filterByCategory(category)
        .forEach(function(item) {
        item.render($menuItems)
    })
}

}
var singleton

export default Menu