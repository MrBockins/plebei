import axios from "axios";
import * as querystring from "query-string";
import tree from "phrase-tree";
import * as util from "util";


let query = querystring.stringify({
    properties: JSON.stringify({
        annotators: "parse",
        outputFormat: "json"
    })
});

let nlpURL = `http://nlp.eastus.cloudapp.azure.com/nlp?${query}`;


export function parse(text) {

  text = text.replace(/[()]/g, p => ({"(": "{", ")": "}"}[p]));



  return axios.post(
    nlpURL,
    text,
    { 
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  ).then(response => {
    response.parsedData = response.data.sentences.map(x => {
        let t = tree(x.parse);

        return t;
    });
    return response;
  });
}



export function tree2Text(tree) {

  function inner(tree) {
      if (tree.children.length === 0) {
          return (tree.text
              .replace(/[{}]/g, p => ({"{": "(", "}": ")"}[p]))
          );
      }
      return tree.children.map(inner).join(" ");
  }

  return inner(tree).replace(/de le/g, "du");
}


function isLeaf(tree) { return tree.text !== ""; }


function removeFluffRecurse(tree, remove=true) {
    if (isLeaf(tree)) { return tree; }

    let newChildren = tree.children
        .map(x => removeFluff(x, true))
        .filter(x => x);

    if (newChildren.length === 0) { return undefined; }

    return {
        tag: tree.tag,
        text: tree.text,
        children: newChildren
    };
}

export function removeFluff(tree, remove=true) {
    switch(tree.tag) {
        case "ADJ":
        case "ADV":
        case "COORD":
            return remove ? undefined : tree;
        case "NP": {
            if (tree.children[1] && tree.children[1].tag === "PUNCT" && tree.children[2] && tree.children[2].tag === "PP") {
                return {
                    tag: tree.tag,
                    text: tree.text,
                    children: tree.children.slice(0,1)
                };
            }
            break;
        }
        case "PP": {
            let child = tree.children[0];

            if (child.tag === "PRON" && child.text.match(/^qui$/i)) {
                return undefined;
            }
        }
    }
    return removeFluffRecurse(tree, remove);
}



const funnyMod = [
  'tabarnouche',
  'tabaslaque',
  'sacramouille',
  'baptême',
  'diable',
  'saperlipopette',
  'ciboulette',
  'bâtard'
]


export function makeItFunny(tree, prob=0.25) {
    switch(tree.tag) {
        case "NP": {
            if (isLeaf(tree)) return tree;
            if (tree.children[0].tag !== "DET") break;
            if (tree.children[0].text.match(/'$/)) break;
            if (Math.random() < 0.7) break;

            let modifier = funnyMod[Math.floor(Math.random() * funnyMod.length)];

            if (tree.children[0].text.match(/s$/)) { modifier += "s"; }

            modifier += " de";

            let mod = {
                tag: "ADV",
                text: modifier,
                children: []
            };

            return {
                tag: tree.tag,
                text: tree.text,
                children: [ makeItFunny(tree.children[0]), mod, ...tree.children.slice(1) .map(makeItFunny)]

            };
        }
    }
    if (isLeaf(tree)) { return tree; }

    let newChildren = tree.children
        .map(x => makeItFunny(x, prob));

    return {
        tag: tree.tag,
        text: tree.text,
        children: newChildren
    };
}

