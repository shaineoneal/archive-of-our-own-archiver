import type { GvizRow } from "@/types/gvizDataTable.ts";

/**
 * Compares two arrays and returns a boolean array indicating which elements in the search list are found in the response.
 *
 * @param {number[]} searchList - The list of work ids to search for.
 * @param {GvizRow[]} response - The gviz rows to search within.
 * @returns {boolean[]} A boolean array where each element indicates if the corresponding item in the search list was found in the response.
 */
export function compareArrays(searchList: number[], response: GvizRow[]): boolean[] {

    let boolArray: boolean[] = new Array(searchList.length).fill(false);

    logger.debug('searchList', searchList);
    logger.debug('searchList type', typeof searchList[1]);
    logger.debug('response', response);
    if(response.length > 1) {
        logger.debug('response type', typeof response[1].c?.[1]?.v);
    }

    searchList.forEach((searchItem) => {
        response.forEach((responseItem) => {
            if (searchItem === responseItem.c?.[1]?.v) {
                boolArray[searchList.indexOf(searchItem)] = true;
                response.splice(response.indexOf(responseItem), 1);
            }

        });
    });

    return boolArray;
}