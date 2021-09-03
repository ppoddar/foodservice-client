import Category from "./category.js"

// visible order of categories
// all possible categories
const PRE_DEFINED_CATEGORIES = [
    new Category({'id':'chicken', 'label':'Chicken',  'icon':''}),
    new Category({'id':'fish',    'label':'Fish',     'icon':''}),
    new Category({'id':'mutton',  'label':'Mutton',   'icon':''}),
    new Category({'id':'veg',     'label':'Vegetarian', 'icon':''}),
    new Category({'id':'side',    'label':'Sides',    'icon':''}),
    new Category({'id':'other',   'label':'Others',   'icon':''}),
    new Category({'id':'featured','label':'Featured',  'icon':''}),

]

const DEFAULT_LABEL = 'Other'


/**
 * maintains a list of category objects
 */
class Categories {
    static ORDER = ['chicken', 'fish', 'mutton', 'veg', 'side']
    /**
     * Create an empty array of category objects
     */
    constructor () {
        this.categories = []
    }
    /**
     * Gets the label for given id. Linear serach all PRE_DEFINED_CATEGORIES
     * If no category with given id is predefined, retunes a default label
     * @param {*} id 
     * @returns 
     */
    getLabelForId(id) {
        for (var i = 0; i < PRE_DEFINED_CATEGORIES.length; i++) {
            if (PRE_DEFINED_CATEGORIES[i].id == id) 
                return PRE_DEFINED_CATEGORIES[i].label
        }
        return DEFAULT_LABEL
    }

    /**
     * Get labels for all category objects in this collection.
     *  
     * @returns 
     */
    getLabels() {
        var labels = []
        for (var i = 0; i < this.categories.length; i++) {
            labels.push(this.categories[i].label)
        }
    }

    /**
     * Gets a category with given label
     * @param {*} label 
     * @returns a category or null 
     */
     getByLabel(label) {
        for (var i = 0; i < this.categories.length; i++) {
            var c = this.categories[i]
            if (c.label == label) 
                return c
        }
    }
    /**
     * Finds a predefined category by given id. If not found, retruns 
     * a default category
     * @param {*} id 
     * @returns 
     */
    findPredefinedCategoryById(id) {
        var category = this.searchCategoryById(id, PRE_DEFINED_CATEGORIES)
        if (category) return category
        category = this.findPredefinedCategoryById('other')
        if (category) return category
        console.error(`no pre-defined category for id ${id}`)
    }

    searchCategoryById(id, list) {
        var array = list || this.categories
        for (var i = 0; i < array.length; i++) {
            var c = array[i]
            if (c.id == id) 
                return c
        }
    }


    /**
     * Adds a new category with given id. 
     * The label for the category 
     * is decided by a predefined mapping
     * @param {string} id 
     */
    addCategory(id) {
        var category = this.searchCategoryById(id, this.categories)
        if (category) {
            console.log(`addCategory(): found existing category ${category}`)
            return category
        }
        category = this.findPredefinedCategoryById(id)
        console.log(`addCategory(): found pre-defined category ${category}. adding...`)
        this.categories.push(category)
        return category
    }

     /*
     * Builds drop-down elements to select category 
     * TODO : take $dropdown
     */
     buildCategoryOptions($dropdown) {
        //var $dropdown = $e($div, '#category-selection-dropdown')
        var $all = this.buildCategoryOption(null, 'All')
        $dropdown.append($all)
        for (var i = 0; i < Categories.ORDER.length; i++) {
            var category_id = Categories.ORDER[i]
            var $option = this.buildCategoryOption(category_id, this.getLabelForId(category_id))
            $dropdown.append($option)
        }
    }

    /*
     * A dropdown option selects items from a particular category.
     * The category lable is updated.
     * @param name category name. Null implies no filtering i.e. all items. 
     * @param label a label to show. 
     */
    buildCategoryOption(id, label) {
        //console.log(`buildCategoryOption ${label}`)
        var $button = $('<button>')
        $button.text(label)
        var _this = this
        $button.on('click', function() {
            _this.selectByCategory.apply(_this, [id])
            $('#category-option').text(label)
        })
        return $button
    }
}

export {Categories, PRE_DEFINED_CATEGORIES}