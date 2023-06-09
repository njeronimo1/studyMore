import { render, screen, fireEvent, waitFor  } from "@testing-library/react";
import { Login } from "../Pages/Auth/Login";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Home } from "../Pages/Home/Home";
import userEvent from "@testing-library/user-event";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth as AuthLoginFirebase } from '../services/firebaseAuth';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

jest.mock('firebase/auth');

describe('Autenticação', () => {
    it("Login", async () => {
        render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>);
        
        const buttonEnviar = screen.getByRole('button', {name: 'entrar'});

        userEvent.type(screen.getByTestId('inputEmail'), "teste@teste.com.br");
        userEvent.type(screen.getByTestId('inputSenha'), "teste123");

        fireEvent.click(buttonEnviar);

        setTimeout(()=>{
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        }, 5000);
    })
})