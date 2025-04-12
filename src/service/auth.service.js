import axios from 'axios';
const api = import.meta.env.VITE_APP_API_LG;

class AuthServices {
    funcLogin(user) {
        const formData = new URLSearchParams();
        for (const key in user) {
            formData.append(key, user[key]);
        }
        return axios
            .post(api + 'login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res) => {
                if (res?.data) {
                    const currentDate = new Date();
                    const expireTokenTime = new Date(currentDate.getTime() + res.data.metadata.atokenExp * 60 * 1000).toString();
                    const jToken = { ExpireToken: expireTokenTime, ...res.data };
                    localStorage.setItem('user', JSON.stringify(jToken));
                }
                return res.data;
            });
    }
    funcRegister(user) {
        const formData = new URLSearchParams();
        for (const key in user) {
            formData.append(key, user[key]);
        }
        return axios
            .post(api + 'register', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res) => {
                return res.data;
            });
    }
    funcSignout(user) {
        const formData = new URLSearchParams();
        for (const key in user) {
            formData.append(key, user[key]);
        }
        return axios
            .post(api + 'logout', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((res) => {
                return res.data;
            });
    }
}
export default new AuthServices();
