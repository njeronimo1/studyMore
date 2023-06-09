import { render, screen, fireEvent, waitFor  } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cadastrar } from '../Pages/Auth/Cadastrar';
import { BrowserRouter, useNavigate } from "react-router-dom";

jest.mock('firebase/auth');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('render correctly', () => {
    it('correctly render registration screen', () => {
        render(
        <BrowserRouter>
            <Cadastrar />
        </BrowserRouter>);

        expect(screen.getByText("Cadastre-se")).toBeInTheDocument();
    })

    it('register correctly', () => {
        render(
        <BrowserRouter>
            <Cadastrar />
        </BrowserRouter>);

        userEvent.type(screen.getByTestId('inputNome'), "teste");
        userEvent.type(screen.getByTestId('inputEmail'), "teste@teste.com.br");
        userEvent.type(screen.getByTestId('inputSenha'), "teste123");
        userEvent.type(screen.getByTestId('inputConfirmSenha'), "teste123");

        const button = screen.getByTestId('buttonEnviarCadastro');

        fireEvent.click(button);
        screen.debug();

        setTimeout(()=>{
            expect(mockNavigate).toHaveBeenCalledWith('/');
        }, 5000);
    })
})