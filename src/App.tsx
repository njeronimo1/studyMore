
import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, VStack } from "@chakra-ui/react";
import { AuthProviderGoogle } from "./contexts/AuthGoogle/AuthGoogle";
import { AuthProvider } from "./contexts/Auth/AuthProvider";
import { Router } from "./Router";
import { PlanosEstudoProvider } from "./contexts/PlanosEstudo/PlanosEstudoProvider";
import { ObjetivoProvider } from "./contexts/Objetivos/ObjetivoProvider";
import { TarefaProvider } from "./contexts/Tarefa/TarefaProvider";
import { AnotacaoProvider } from "./contexts/Anotacao/AnotacaoProvider";
import "./style-global.css";

export function App() {
  return (
    <AuthProvider>
      <AuthProviderGoogle>
        <PlanosEstudoProvider>
          <ObjetivoProvider>
            <TarefaProvider>
              <AnotacaoProvider>
                <Router />
              </AnotacaoProvider>
            </TarefaProvider>
          </ObjetivoProvider>
        </PlanosEstudoProvider>
      </AuthProviderGoogle>
    </AuthProvider>
  )
}