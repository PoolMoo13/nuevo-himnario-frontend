import { BrowserRouter, Routes, Route } from "react-router-dom";


import App from "./App";
import ListHymns from "./pages/ListHymns";
import ShowHymn from "./pages/ShowHymn";
import Home from "./pages/Home";
import Admin from "./pages/admin/Admin";
import EditarHimnario from "./pages/admin/EditarHimnario";
import VerHimnario from "./pages/admin/VerHimnario";
import EditHimno from "./pages/admin/EditarHimno";

const AppRoutes = () => (
    <App>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/:hymnalId" element={<EditarHimnario />} />
                <Route path="/admin/:hymnalId/:hymnalId" element={<VerHimnario />} />
                <Route path="/admin/:hymnalId/:hymnalId/edit" element={<EditHimno />} />

                <Route path="/:hymnalId" element={<ListHymns />} />
                <Route path="/:hymnalId/:hymnId" element={<ShowHymn />} />
            </Routes>
        </BrowserRouter>
    </App>
);

export default AppRoutes;