import { BrowserRouter, Routes, Route } from "react-router-dom";


import App from "./App";
import ListHymns from "./pages/ListHymns";
import ShowHymn from "./pages/ShowHymn";
import Home from "./pages/Home";


const AppRoutes = () => (
<App>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:hymnalId" element={<ListHymns />} />
        <Route path="/:hymnalId/:hymnId" element={<ShowHymn />} />
    </Routes>
    </BrowserRouter>
</App>
);

export default AppRoutes;