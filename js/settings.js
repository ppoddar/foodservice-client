class Settings {
    constructor() {
        this.askForAdditionalItems = true
    }
    static instance() {
        if (!singleton) {
            singleton = new Settings()
        }
        return singleton
    }
}

var singleton

export default Settings