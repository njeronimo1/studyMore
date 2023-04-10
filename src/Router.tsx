import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./contexts/RequireAuth";
import { Cadastrar } from "./Pages/Auth/Cadastrar";
import { Login } from "./Pages/Auth/Login";
import { Home } from "./Pages/Home/Home";
import { Usuario } from "./Pages/Usuario/Usuario";
import { PlanosEstudo } from "./Pages/PlanosEstudo/PlanosEstudo";
import { DetailPlanoEstudo } from "./Pages/PlanosEstudo/DetailPlanoEstudo";
import { DetailObjetivo } from "./Pages/Objetivo/DetailObjetivo";


export function Router(){
    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />}></Route>
                    <Route path="/cadastrar" element={<Cadastrar />}></Route>
                    <Route path="/home" element={ <Home /> }></Route>
                    <Route path="/usuario" element={<Usuario />}></Route>
                    <Route path="/planos-estudo" element={<PlanosEstudo />}></Route>
                    <Route path="/planos-estudo/:id" element={<DetailPlanoEstudo />}></Route>
                    <Route path="/objetivo/:id" element={<DetailObjetivo />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}