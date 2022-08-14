
class ListnerListObject {
    constructor(methods) {
        this.Data = methods;
        this.ListnerList = Object.keys(methods).filter(method => !!methods[method].listner);
        this.length = this.ListnerList.length;
    }
}

export function ListnerListObjectFactory(methods) {
    return new ListnerListObject(methods);
}
