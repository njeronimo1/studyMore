import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API
})

export const useApi = () => ({
    signin: async (email:string) => {

        const usuario = localStorage.getItem('usuario');

        if(usuario){

            let usuario_ = JSON.parse(usuario);
            // console.log(email, password, "Email e senha");
            // console.log(usuario_);

            if(email === usuario_.email){
                return {
                    user: {id: usuario_.id, name:usuario_.name, email:usuario_.email},
                    token: usuario_.id
                }
            }
            
        }else{
            return{
                user: {id: '0', name:'', email:''},
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