import axios from 'axios';
import authHeader from '../service/AuthHeader';
const api = import.meta.env.VITE_APP_API;

class API {
    async get(patch) {
        const url = api + patch;
        try {
            const res = await axios.get(url, {
                headers: authHeader(),
                timeout: 10000
            });
            return res;
        } catch (error) {
            return error
        }
    }
    async create(patch, params) {
        const url = api + patch;
        try {
            const res = await axios.post(url, params, {
                headers: authHeader(),
                timeout: 10000
            });
            return res;
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async update(patch, params) {
        const url = api + patch;
        try {
            const res = await axios.put(url, params, {
                headers: authHeader(),
                timeout: 10000
            });
            return res;
        } catch (error) {
            console.log(error);
        }
    }
    async updatev2(patch, params) {
        const url = api + patch;
        try {
            const res = await axios.patch(url, params, {
                headers: authHeader(),
                timeout: 10000
            });
            return res;
        } catch (error) {
            return error
        }
    }
    async remove(patch, params) {
        const url = api + patch;
        try {
            const res = await axios.delete(url, params, {
                headers: authHeader(),
                timeout: 10000
            });
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async delete(patch, params) {
        const url = api + patch;

        try {
            const res = await axios.delete(url, {
                headers: authHeader(),
                data: params,
                timeout: 10000
            });
            return res;
        } catch (error) {
            console.log(error);
        }
    }
}
export default new API();
