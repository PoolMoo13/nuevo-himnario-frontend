import { BrowserRouter, Routes, Route } from "react-router-dom";


import App from "./App";
import ListHymns from "./pages/ListHymns";
import ShowHymn from "./pages/ShowHymn";
import Home from "./pages/Home";
import Admin from "./pages/admin/Admin";
import EditarHimnario from "./pages/admin/EditarHimnario";
import VerHimnario from "./pages/admin/VerHimnario";
import EditHimno from "./pages/admin/EditarHimno";
import { NotFoundPage } from "./pages/Error404/Page404";

const AppRoutes = () => (
    <App>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/:slug" element={<EditarHimnario />} />
                <Route path="/admin/:slug/:hymnalId" element={<VerHimnario />} />
                <Route path="/admin/:slug/:hymnalId/:edit" element={<EditHimno />} />

                <Route path="no-found" element={<NotFoundPage/>} />

                <Route path="/:hymnalId/:hymnId" element={<ShowHymn />} />
                <Route path="/:hymnalId" element={<ListHymns />} />

            </Routes>
        </BrowserRouter>
    </App>
);

export default AppRoutes;