import axios from 'axios';

const url = 'http://localhost:3001/persons';

const getAll = async () =>{
    const response = await axios.get(url);
    return response.data;
}

const addPerson = async (newPerson) =>{
    const response = await axios.post(url, newPerson);
    return response.data;
}

const updPerson = async (id, newPerson) =>{
    const response = await axios.put(`${url}/${id}`, newPerson);
    return response.data;
}

const deletePerson = async (id) =>{
    const response = await axios.delete(`${url}/${id}`);
    return response.data;
}

export {getAll, addPerson, updPerson, deletePerson}