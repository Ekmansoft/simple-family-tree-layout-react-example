import React from 'react';
import { LocalTreeBackend, ProfileLink } from 'simple-family-tree-model';
import { createFamilyLayout, RootLayout, generateProfileList, VerticalTreeLayout } from 'simple-family-tree-layout'
import { buildTreeFromRemoteGedcomFile } from 'simple-family-tree-gedcom-decoder';

import './App.css';

interface FamilyTreeState {
  tree: LocalTreeBackend,
  filename: string,
  fileDecoded:boolean,
  focusProfile:string,
  layout: RootLayout,
}

const styles = {
  container: {
    width:"100%",
    height:"100%",
    class:"row"
  },
  listColumn: {
    overflowY: "scroll",
    width:"300px",
    float:"left",
  },
  treeColumn: {
    float:"right",
    width:"50%",
  }

} as const;



export class FamilyTreeComponent extends React.Component<{},FamilyTreeState> {
  state: FamilyTreeState = {
    tree: new LocalTreeBackend(),
    filename:'./555SAMPLE.GED',
    fileDecoded:false,
    focusProfile:"",
    layout: new RootLayout()
  };

  private async handleDecode(): Promise<boolean> {
    console.log("gedcom decode start");
    const result = await buildTreeFromRemoteGedcomFile(this.state.tree, this.state.filename);
    this.setState({fileDecoded: true})
    console.log("gedcom decode done", result);
    return true;
  }

  render() {
    if (!this.state.fileDecoded) {
      this.handleDecode();
    }
    let focusProfileLocal = this.state.tree.getRootProfile();
    console.log(window.location.href);
    if (window.location.href.includes("profile")) {
      let url = window.location.href;
      let profilestring = url.substring(url.lastIndexOf('/')+1);
      console.log("focusprofile ", profilestring);
      focusProfileLocal = new ProfileLink(profilestring);
    }
    console.log("focusprofile2 ", focusProfileLocal);
    if (focusProfileLocal !== undefined) {
      return (
          <div style={styles.container}>
              <div style={styles.listColumn}>{generateProfileList(this.state.tree)}</div>
              <div style={styles.treeColumn}>
              <VerticalTreeLayout tree={this.state.tree}
                                  layout={createFamilyLayout(this.state.tree, focusProfileLocal, 2, 2)}
                                  focusProfile={focusProfileLocal} />
              </div>
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


const App = () => {
  console.log("App start");

  return (
    <div className="App">
    <header className="App-header">
      <FamilyTreeComponent />
    </header>
    </div>
    );
  }


export default App;
