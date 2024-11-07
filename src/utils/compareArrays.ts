import log from './logger';
/**
 * Compares two arrays and returns a boolean array indicating which elements in the search list are found in the response.
 *
 * @param {any[]} searchList - The list of items to search for.
 * @param {any[]} response - The list of items to search within.
 * @returns {boolean[]} A boolean array where each element indicates if the corresponding item in the search list was found in the response.
 */
export function compareArrays(searchList: any[], response: any[]): boolean[] {

    let boolArray: boolean[] = new Array(20).fill(false);

    log('searchList', searchList);
    log('response', response);

    searchList.forEach((searchItem) => {
        response.forEach((responseItem) => {
            if (searchItem === responseItem.c[0].f) {
                boolArray[searchList.indexOf(searchItem)] = true;
                response.splice(response.indexOf(responseItem), 1);
            }

        });
    });

    return boolArray;
}