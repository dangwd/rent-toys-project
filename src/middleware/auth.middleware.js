export default async function auth() {
    if (!localStorage.getItem('user')) {
        return false;
    }

    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const expireDate = new Date(user['ExpireToken']);

        if (expireDate <= new Date()) {
            localStorage.removeItem('user');
            return false;
        }

        return true;
    } catch (e) {
        localStorage.removeItem('user');
        return false;
    }
}
