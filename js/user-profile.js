class UserProfile {
    constructor(data) {
        this.dob   = 'dib' in data ? data['data'] : ''
        this.image = 'image' in data ? data['image'] : 'no-image.png'
    }
}
export default UserProfile