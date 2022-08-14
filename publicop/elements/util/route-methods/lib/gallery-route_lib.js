import { geneReformTools } from '../../libs/article-form_lib';

function getToolsReform(imagereform, galleryreform, imageeditype, galleryeditype) {
    let toolId = !!imageeditype ? `${imagereform}Tools` : `${galleryreform}Tools`;
    let [formTools] = this[toolId];
    let reformTools = [formTools, imagereform || galleryreform, imageeditype || galleryeditype, toolId];
    return reformTools;
}
function genNewContentOptions(formTools, editype, reformeToolsID, reform) {
    let [reformTools, popupId] = [geneReformTools.call(this, formTools, editype), reformeToolsID];
    let options = { popupId, reformeToolsID, reformTools, reform };
    return options;
}
export async function getGalleriesReformTools() {
    let [mediaTools] = this.mediaTools;
    let reformeToolsID = `${mediaTools.id}-form`;
    let response = await this.newGetCategories(mediaTools, reformeToolsID);
    let Options = genNewContentOptions.call(this, mediaTools, 'galleries', 'galleriesReformedTools', 'media');
    return { response, reformeToolsID, Options };
}
export async function ReformNewContentType(query) {
    let { galleryeditype, galleryreform, imageeditype, imagereform, reformedtoolsid } = query;
    let [formTools, reform, editype, toolId] =
        getToolsReform.call(this, imagereform, galleryreform, imageeditype, galleryeditype);
    let options = genNewContentOptions.call(this, formTools, editype, reformedtoolsid, reform);
    if (formTools) return this.routeNewContent(formTools, query, options);
    throw `newContentType: no toolID found by the name ${toolId}`;
}
export async function resolveGaleriesReforms(response, reformeToolsID, options) {
    let { reformTools: [tools, toolName, toolsKeys, toolsNames], reform } = options;
    this[reformeToolsID] = [];
    this.setDataSimple(response, reformeToolsID);
    this.setReformTools(tools, toolsKeys, reformeToolsID);
    this.resolveToInfoData([...toolsNames]);
    this.ReFormGallery = reform;
    return toolName;
}
export async function shouldRequestCategories(query) {
    return (!this.categories && (query.galleryeditype === "galleries" ||
        query.galleryeditype === "images")) || query.galleryreform === "revert-initial"
}
