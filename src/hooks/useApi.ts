import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API
})

export const useApi = () => ({
    signin: async (email:string, password:string) => {

        const usuario = localStorage.getItem('db-users');

        if(usuario){

            let user = JSON.parse(usuario);
            // console.log(user);

            if(email === user.email && password === user.password){
                return {
                    user: {id: 1, name:user.name, email:user.email},
                    token: '123456789'
                }
            }
            
        }else{
            return{
                user: {id: 0, name:'', email:''},
                token: ''
            }
        }

        
        // const response = await api.post('/signin', { email, password });
        // return response.data;
    },

    sigout: async() => {
        return {status: true};
        // const response = await api.post('/logout');
        // return response.data;
    },

    signup: async (name: string, email: string, password: string) => {
        
        const usuario = localStorage.getItem('db-users');

        if(usuario){
            let users = JSON.parse(usuario);
            let existe = users.filter(m => m.email === email);

            if(existe.length > 0){
                return false;
            }else{
               let usuarioCadastrar = {
                  id: new Number(),
                  name: name,
                  email: email,
                  password: password,
                  apelido: '',
                  imagem: ''
               } 

               localStorage.setItem('db-users', JSON.stringify(usuarioCadastrar));
            }
        }else{
            let usuarioCadastrar = {
                id: new Number(),
                name: name,
                email: email,
                password: password,
                apelido: '',
                imagem: ''
             } 

             localStorage.setItem('db-users', JSON.stringify(usuarioCadastrar));
        }

        return true;
    },
})