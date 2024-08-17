import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import plugins from "../plugins";

const ToolInterface: React.FC = () => {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            {plugins.map((plugin) => (
              <li key={plugin.id}>
                <Link to={`/${plugin.id}`}>{plugin.name}</Link>
              </li>
            ))}
          </ul>
        </nav> */}
        <div>
          <Routes>
            {plugins.map((plugin) => (
              <Route
                key={plugin.id}
                path={`/${plugin.id}`}
                element={<plugin.component />}
              />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default ToolInterface;
