/* @@@ REACT JS : Technology Enterprise Edition - Mappings API @@@
   @@@ BACKEND : FLASK FRAMEWORK @@@
   @@@ module: app.js @@@
   @@@ version: 2.0 @@@
*/

import React from "react";
import Header from "./components/UI/Header";
import ContactBody from "./components/UI/ContactBody";
import UnitBody from "./components/UI/UnitBody";

const App = () => {
  return (
    <Header>
      <div>
        <ContactBody />
        <UnitBody />
      </div>
    </Header>
  );
};

export default App;
