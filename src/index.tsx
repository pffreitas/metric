import ReactDOM from "react-dom";
import { App } from "./App";
import { store } from './store'
import { Provider } from 'react-redux'
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@mui/material";
import {
    HashRouter,
    Routes,
    Route,
} from "react-router-dom";
import { EscapedBugs } from "./features/escapedBugs/EscapedBugs";
import { BugsPage } from "./features/bugs/bugs.page";
import { Layout } from "./components/layout";

const theme = createTheme({
    palette: {
        primary: {
            main: '#202020',

        },
        secondary: {
            main: '#eee',
        },
    },
});

console.log({ theme });

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Provider store={store}>
            <HashRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<App />} />
                        <Route path="/bugs" element={<BugsPage />} />
                    </Route>
                </Routes>
            </HashRouter>
        </Provider>
    </ThemeProvider>, document.getElementById("root"));
