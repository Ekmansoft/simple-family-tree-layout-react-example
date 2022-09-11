import {parse,compact} from 'gedcom';
import { Family, LocalTreeBackend, createProfile, ProfileLink, ProfileSex, FamilyLink } from 'simple-family-tree-model';


  export function decodeGedcom(fTree: LocalTreeBackend, gedcomData: string)
  {
    let localGedcomData = gedcomData
    let firstProfile = false;
    console.log("data length ", gedcomData.length);
    const familyTree = parse(localGedcomData);
    console.log(compact(familyTree))
    console.log(familyTree)

    // First pass, add profiles to tree
    for(let i = 0; i < familyTree.children.length; i++ ) {
        if (familyTree.children[i].type === "INDI") {
        let gedcomIndividual = familyTree.children[i]
        console.log(gedcomIndividual);
        if (gedcomIndividual.data !== undefined) {
            const personData = gedcomIndividual.data;
            //console.log(personData);
            //console.log(personData.SEX);
            //console.log(personData.xref_id);
            const name = String(personData.NAME).replaceAll('/','');

            let sex: ProfileSex = ProfileSex.Unknown;
            if (personData.SEX === "F") {
            sex = ProfileSex.Female;
            } else if (personData.SEX === "M") {
            sex = ProfileSex.Male;
            }

            console.log(name);
            let birthDate = "";
            if (personData["BIRTH/DATE"] !== undefined) {
            birthDate = String(personData["BIRTH/DATE"]);
            }
            let birthPlace = "";
            if (personData["BIRTH/PLACE"] !== undefined) {
            birthPlace = String(personData["BIRTH/PLACE"]);
            }
            let deathDate = "";
            if (personData["DEATH/DATE"] !== undefined) {
            deathDate = String(personData["DEATH/DATE"]);
            }
            let deathPlace = "";
            if (personData["DEATH/PLACE"] !== undefined) {
            deathPlace = String(personData["DEATH/PLACE"]);
            }
            //creatAndAddPerson(personData.NAME, personData.)
            let profile = createProfile(name, sex, birthDate, birthPlace, deathDate, deathPlace);
            profile.profileId = new ProfileLink(String(personData.xref_id));
            let result = fTree.addNewProfile(profile);
            console.log("added profile ", result);
            if (firstProfile ) {
            firstProfile  = false;
            console.log("focusperson {}", result);
            }

        }
        }
    }

    // Second pass, add family connections to tree
    for(let i = 0; i < familyTree.children.length; i++ ) {
        if (familyTree.children[i].type === "FAM") {
        let gedcomFamily = familyTree.children[i]
        console.log(gedcomFamily);
        if (gedcomFamily.data !== undefined) {
            const familyData = gedcomFamily.data;
            console.log(familyData);
            //console.log(personData.SEX);
            //console.log(personData.xref_id);
            let familyId = String(familyData["xref_id"]);
            let family = new Family();
            family.familyId = new FamilyLink(familyId);
            fTree.addNewFamily(family);
            if (familyData["@HUSBAND"] !== undefined) {
            let result = fTree.addParentToFamily(new FamilyLink(familyId), new ProfileLink(String(familyData["@HUSBAND"])))
            console.log("husband in fam", result);
            //family.parents.append(new ProfileLink(String(familyData["@HUSBAND"])));
            }
            if (familyData["@WIFE"] !== undefined) {
            let result = fTree.addParentToFamily(new FamilyLink(familyId), new ProfileLink(String(familyData["@WIFE"])))
            console.log("wife in fam", result);
            //family.parents.append(new ProfileLink(String(familyData["@WIFE"])));
            }
            if (familyData["@CHILD"] !== undefined) {
            let result = fTree.addChildToFamily(new FamilyLink(familyId), new ProfileLink(String(familyData["@CHILD"])))
            console.log("child in fam", result);
            //family.children.append(new ProfileLink(String(familyData["@CHILD"])));
            }

        }
        }
    }
    }
