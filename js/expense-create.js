
const EXPENSE_CATEGORIES = ['rent', 'inventory', 'other', 'personal']
/**
 * A dialog to create an expense.
 */
class ExpenseCreate {
    open(cb) {
        var data = {'categories': EXPENSE_CATEGORIES,
                    'users': UserAdmin.instance().getUsersWithPermission('expense')}
        openDialog('templates/expense-create.mustache', 
        data, 
        () => {
            if (this.validate($(this))) {
                var payload = this.collectInput($(this))
                sendExpenseCreateRequest(payload, function(response) {
                    var status = response['status']
                    if (status != 200) {
                        openWarningDialog('error creating expense', response['message'])
                    }
                })
            }
        })
    }

    validate($form) {
        var date     = $e($form, '#expense-date').val()
        var title    = $e($form, '#expense-title').val()
        var category = $e($form, '#expense-category').text()
        var amount   = $e($form, '#expense-amount').val()
        var user     = $e($form, '#expense-user').text()
        var comment  = $e($form, '#expense-comment').text()
        if (!title) {
            this.show_error('must have a name for a expense')
            return false
        }
    }
}

export default ExpenseCreate