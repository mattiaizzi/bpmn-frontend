import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app.router";
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';
import { Suspense } from "react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

const queryClient = new QueryClient();
const theme = createTheme();

const App = () => (
    <ThemeProvider theme={theme}>
        <Suspense fallback={<div>Loading... </div>}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AppRouter />
                </BrowserRouter>
            </QueryClientProvider>
        </Suspense>
    </ThemeProvider>
);

export default App;