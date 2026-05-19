import axios from "axios";
const baseURL = "/api/notes";

const getAll = () => {
    const req = axios.get(baseURL);
    const nonExisting = {
        id: 10000,
        content: "This note is not saved to server",
        important: true
    };
    return req.then((res) => res.data.concat(nonExisting)); 
};

// const getAll = () => {
//     const req = axios.get(baseURL);
//     return req.then((res) => res.data); 
// };

const create = (newObject) => {
    const req = axios.post(baseURL, newObject); 
    return req.then((res) => res.data);
};

const update = (id, newObject) => {
    const req = axios.put(`${baseURL}/${id}`, newObject);
    return req.then((res) => res.data);
}

export default {
    getAll,
    create,
    update
}