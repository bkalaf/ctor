function isOf(typename) {
    return (x) => typeof x === typename;
}
const isUndefined = isOf('undefined');

function compl(p) {
    return x => !p(x);
}
const isNotUndefined = compl(isUndefined);


const isNode = (obj) => isNotUndefined(obj) ? 'members' in obj : false;
const isLeaf = compl(isNode);

const treeIterator = (acc, current) => f => {
    if (isNode) {
        const members = current.members;
        acc.push(this);
        members.map(f)
    } else {
        return f(current);
    }
}
const traverseTree = (f) => (treeAsList) => {
    const [head, ...tail] = treeAsList;
    if (tail.length === 0) {
        return f(head);
    }
    return [f(head), ...traverseTree(f)(tail)]

}