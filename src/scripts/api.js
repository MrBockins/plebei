import axios from "axios";
import * as querystring from "query-string";
import * as tree from "phrase-tree";

let query = querystring.stringify({
    properties: JSON.stringify({
        annotators: "parse",
        outputFormat: "json"
    })
});

let nlpURL = `http://nlp.eastus.cloudapp.azure.com/nlp?${query}`;


export function parse(text) {

  text = text.replace(/[()]/g, p => ({"(": "{", ")": "}"}[p]));

  console.log(text);

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
        console.log(x);
        return tree(x.parse);
    });
    return response;
  });
}



export function tree2Text(tree) {
  if (tree.children.length === 0) return tree.text.replace(/[{}]/g, p => ({"{": "(", "}": ")"}[p]));
  return tree.children.map(tree2Text).join(" ");
}


export function removeFluff(tree, remove=false) {
  let newChildren;
  switch(tree.tag) {
    case "ROOT":
    case "SENT":
        newChildren = tree.children
            .map(x => removeFluff(x, true))
            .filter(x => x !== undefined);
        return {
            tag: tree.tag,
            text: tree.text,
            children: newChildren
        };
    case "NP":
        newChildren = tree.children
            .map(x => removeFluff(x, true))
            .filter(x => x !== undefined);
        return {
            tag: tree.tag,
            text: tree.text,
            children: newChildren
        };
    case "ADV":
    case "AP":
    case "ADJ":
        return remove ? undefined : tree;

    default:
        return tree;
  }
}

window.f = parse;
window.t2t = tree2Text;
window.removeFluff = removeFluff;

