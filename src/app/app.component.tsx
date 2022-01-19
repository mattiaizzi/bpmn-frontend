import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app.router";
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';
import { Suspense } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';

declare module '@mui/material/styles' { }

const theme = createTheme();

const queryClient = new QueryClient();

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