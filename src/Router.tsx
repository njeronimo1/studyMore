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
                    <Route path="/home" element={ <RequireAuth><Home /></RequireAuth> }></Route>
                    {/* <Route path="/usuario" element={<Usuario />}></Route> */}
                    <Route path="/planos-estudo" element={<RequireAuth><PlanosEstudo /></RequireAuth>}></Route>
                    <Route path="/planos-estudo/:id" element={<RequireAuth><DetailPlanoEstudo /></RequireAuth>}></Route>
                    <Route path="/objetivo/:id" element={<RequireAuth><DetailObjetivo /></RequireAuth>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}