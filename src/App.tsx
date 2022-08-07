import React from 'react';
import logo from './logo.svg';
import { Family, LocalTreeBackend, createProfile, ProfileSex  } from 'simple-family-tree-model';
import { createFamilyLayout, generateLayout  } from 'simple-family-tree-layout'

import './App.css';

let tree = new LocalTreeBackend();
let newProfile1 = createProfile("Kalle Andersson", ProfileSex.Male, "19010101", "Umeå, Sweden", "19610101", "Vännäs, Sweden");
let newProfileId = tree.addNewProfile(newProfile1);

let newProfile2 = createProfile("Karin Andersson", ProfileSex.Female, "18990202", "Umeå, Sweden", "19620202", "Vännäs, Sweden");
let newProfile2Id = tree.addNewProfile(newProfile2);

let newFamily = new Family();

let newFamilyId = tree.addNewFamily(newFamily);

let result1 = tree.addParentToFamily(newFamilyId, newProfileId);
let result2 = tree.addParentToFamily(newFamilyId, newProfile2Id);

console.log("addparents ", result1, result2);

let newProfile3 = createProfile("Child Andersson", ProfileSex.Female, "19330303", "Umeå, Sweden", "19930303", "Vännäs, Sweden");
let newProfile3Id = tree.addNewProfile(newProfile3);

let result3 = tree.addChildToFamily(newFamilyId, newProfile3Id);

let newProfile4 = createProfile("Child2 Andersson", ProfileSex.Male, "19330303", "Umeå, Sweden", "19930303", "Vännäs, Sweden");
let newProfile4Id = tree.addNewProfile(newProfile4);

let result4 = tree.addChildToFamily(newFamilyId, newProfile4Id);

console.log("addchildren ", result3, result4);

let mainLayout = createFamilyLayout(tree, newProfileId);


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <svg height="1000" width="1000" className="SvgStyle">
            {generateLayout(mainLayout)}

        </svg>

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
