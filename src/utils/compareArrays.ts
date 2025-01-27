import { log } from './logger';
/**
 * Compares two arrays and returns a boolean array indicating which elements in the search list are found in the response.
 *
 * @param {any[]} searchList - The list of items to search for.
 * @param {any[]} response - The list of items to search within.
 * @returns {boolean[]} A boolean array where each element indicates if the corresponding item in the search list was found in the response.
 */
export function compareArrays(searchList: any[], response: any[]): boolean[] {

    let boolArray: boolean[] = new Array(searchList.length).fill(false);

    log('searchList', searchList);
    log('searchList type', typeof searchList[1]);
    log('response', response);
    if(response.length > 1) {
        log('response type', typeof response[1].c[1].v);
    }

    searchList.forEach((searchItem) => {
        response.forEach((responseItem) => {
            log('searchItem', searchItem, 'responseItem', responseItem.c[1].v);
            if (searchItem === responseItem.c[1].v) {
                boolArray[searchList.indexOf(searchItem)] = true;
                response.splice(response.indexOf(responseItem), 1);
            }

        });
    });

    return boolArray;
}