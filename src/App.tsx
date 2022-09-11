import React, {useRef} from 'react';
import { Family, LocalTreeBackend, Profile, ProfileLink, ProfileSex  } from 'simple-family-tree-model';
import { createFamilyLayout, generateLayout  } from 'simple-family-tree-layout'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'

import './App.css';

function createAndAddProfile(
  tree: LocalTreeBackend,
  name: string,
  sex: ProfileSex,
  birthDate: string,
  birthPlace: string,
  deathDate: string,
  deathPlace: string,
) {
  const profile = new Profile();
  profile.name = name;
  profile.sex = sex;
  profile.birthDate = birthDate;
  profile.birthPlace = birthPlace;
  profile.deathDate = deathDate;
  profile.deathPlace = deathPlace;
  return tree.addNewProfile(profile);
}


let tree = new LocalTreeBackend();
console.log("Create parents in family1 ");
let newProfile1Id = createAndAddProfile(tree, "Kalle Andersson", ProfileSex.Male, "19010101", "Umeå, Sweden", "19610101", "Vännäs, Sweden");
let newProfile2Id = createAndAddProfile(tree, "Karin Helgesson", ProfileSex.Female, "18990202", "Umeå, Sweden", "19620202", "Vännäs, Sweden");

let newFamily1Id = tree.addNewFamily(new Family());

let result1 = tree.addParentToFamily(newFamily1Id, newProfile1Id);
let result2 = tree.addParentToFamily(newFamily1Id, newProfile2Id);

console.log("add parents in family1 ", result1, result2);
console.log("Create children in family1 ");

let newProfile3Id = createAndAddProfile(tree, "Child Andersson", ProfileSex.Female, "19330303", "Umeå, Sweden", "19930303", "Vännäs, Sweden");
let newProfile4Id = createAndAddProfile(tree, "Child2 Andersson", ProfileSex.Male, "19340404", "Umeå, Sweden", "19940404", "Vännäs, Sweden");

let result3 = tree.addChildToFamily(newFamily1Id, newProfile3Id);
let result4 = tree.addChildToFamily(newFamily1Id, newProfile4Id);

console.log("add children in family1", result3, result4);

console.log("Create parents of mother in family1 and thus family2");
let newProfile5Id = createAndAddProfile(tree, "Grandma Andersson", ProfileSex.Female, "186630303", "Umeå, Sweden", "19030303", "Vännäs, Sweden");
let newProfile6Id = createAndAddProfile(tree, "Granddad Andersson", ProfileSex.Male, "186630303", "Umeå, Sweden", "19030303", "Vännäs, Sweden");

let newFamily2Id = tree.addNewFamily(new Family());

let result5 = tree.addChildToFamily(newFamily2Id, newProfile1Id);
let result6 = tree.addParentToFamily(newFamily2Id, newProfile5Id);
let result7 = tree.addParentToFamily(newFamily2Id, newProfile6Id);
console.log("add mother and grandparents to family2", result5, result6, result7);

console.log("Create parents of father in family1 and thus family3");
let newProfile7Id = createAndAddProfile(tree, "Grandma Helgesson", ProfileSex.Female, "186630303", "Umeå, Sweden", "19030303", "Vännäs, Sweden");
let newProfile8Id = createAndAddProfile(tree, "Granddad Helgesson", ProfileSex.Male, "186630303", "Umeå, Sweden", "19030303", "Vännäs, Sweden");

let newFamily3Id = tree.addNewFamily(new Family());

let result8 = tree.addChildToFamily(newFamily3Id, newProfile2Id);
let result9 = tree.addParentToFamily(newFamily3Id, newProfile7Id);
let result10 = tree.addParentToFamily(newFamily3Id, newProfile8Id);
console.log("add father and grandparents to family3", result8, result9, result10);

let focusProfileId = newProfile1Id;
console.log(window.location.href);
if (window.location.href.includes("profile")) {
  let url = window.location.href;
  let profilestring = url.substring(url.lastIndexOf('/')+1);
  console.log(profilestring);
  focusProfileId = new ProfileLink(profilestring);
}
let mainLayout = createFamilyLayout(tree, focusProfileId, 2, 2);

console.log("layout with ", mainLayout.families.size, mainLayout.profiles.size);


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <svg width="800" height="800">
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

function AppScrollable() {
  const Viewer = useRef(null);
  return (
    <div className="App">
      <header className="App-header">
        <UncontrolledReactSVGPanZoom
        ref={Viewer}
        width={800} height={800}
        onZoom={e => console.log('zoom')}
        onPan={e => console.log('pan')}
        onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
      >
        <svg width="800" height="800">
            {generateLayout(mainLayout)}

            </svg>
        </UncontrolledReactSVGPanZoom>

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
