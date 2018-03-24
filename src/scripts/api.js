import axios from "axios";
import * as querystring from "query-string";
import * as tree from "phrase-tree";


console.log("trololo");

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


function isLeaf(tree) { return tree.text !== ""; }


export function removeFluff(tree, remove=true) {
  console.log(tree.tag, tree.text);
  let newChildren;
  switch(tree.tag) {
    case "ADV":
    case "AP":
    case "ADJ":
        return remove ? undefined : tree;

    default:
        if (isLeaf(tree)) return tree;

        newChildren = tree.children
            .map(x => removeFluff(x, true))
            .filter(x => x);
        if (newChildren.length === 0) return undefined;
        return {
            tag: tree.tag,
            text: tree.text,
            children: newChildren
        };
  }
}

window.f = parse;
window.t2t = tree2Text;
window.removeFluff = removeFluff;


console.log({
  f: parse,
  t2t: tree2Text,
  rf: removeFluff
})
