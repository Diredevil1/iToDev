import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./Layout";
import { Films } from "./pages/Films";

import { Characters } from "./pages/Characters";
import { AnimatePresence } from "framer-motion";

export const App = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/films" replace />} />
          <Route path="films" element={<Films />}>
            <Route path=":id" />
          </Route>

          <Route path="characters" element={<Characters />}>
            <Route path=":id" />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};
