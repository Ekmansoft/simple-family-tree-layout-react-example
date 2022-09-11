import React from 'react';
import { LocalTreeBackend } from 'simple-family-tree-model';
import { createFamilyLayout, RootLayout, generateLayout } from 'simple-family-tree-layout'
//import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
import { decodeGedcom } from './decode-gedcom';

import './App.css';

interface FamilyTreeState {
  tree: LocalTreeBackend,
  filename: string,
  fileDecoded:boolean,
  layout: RootLayout
}

async function buildTreeFromFile(tree: LocalTreeBackend, filename: string): Promise<boolean>  {
  const response =  await fetch(filename);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    console.log(message);
    throw new Error(message);
  }
  const gedcomData = await response.text();
  console.log("gedcom length:", gedcomData.length);
  decodeGedcom(tree, gedcomData);

  const rootProfile = tree.getRootProfile();
  if (rootProfile !== undefined) {
    console.log("root profile ", rootProfile.itemLink);
    return true;
  }
  console.log("failed decoding gedcom");
  return false;
}


export class FamilyTreeComponent extends React.Component<{},FamilyTreeState> {
  state: FamilyTreeState = {
    tree: new LocalTreeBackend(),
    filename:'../555sample.ged',
    fileDecoded:false,
    layout: new RootLayout()
  };

  private async handleDecode(): Promise<boolean> {
    const result = await buildTreeFromFile(this.state.tree, this.state.filename);
    this.setState({fileDecoded: true})
    console.log(result);
    const focusProfile = this.state.tree.getRootProfile();
    if (focusProfile !== undefined) {
      console.log(focusProfile);
      this.setState({layout: createFamilyLayout(this.state.tree, focusProfile, 2, 2)})
      return true;
    }
    console.log("decode failed",result);
    return false;
  }

render() {
  if (!this.state.fileDecoded) {
    this.handleDecode();
  }
  const focusProfile = this.state.tree.getRootProfile();
  if (focusProfile !== undefined) {
    return (
        <div>
          A tree...
            <svg width="800" height="800">
            {generateLayout(this.state.layout)}
            </svg>
        </div>
    )
  } else {
    return (
        <div>
          Loading...
        </div>
    )
  }
}

}


//let tree = new LocalTreeBackend();


const App = () => {
  console.log("App start");
  //const { data, error, isPending } = useAsync({ promiseFn: buildTreeLayout })

  console.log("gedfile");

  return (
    <div className="App">
    <header className="App-header">
      <FamilyTreeComponent />
    </header>
    </div>
    );
  }

// function AppScrollable() {
//   const Viewer = useRef(null);
//   return (
//     <div className="App">
//       <header className="App-header">
//         <UncontrolledReactSVGPanZoom
//         ref={Viewer}
//         width={800} height={800}
//         onZoom={e => console.log('zoom')}
//         onPan={e => console.log('pan')}
//         onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
//       >
//         <svg width="800" height="800">
//             {generateLayout(mainLayout)}

//             </svg>
//         </UncontrolledReactSVGPanZoom>

//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
