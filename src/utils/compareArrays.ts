import { log } from './';
//returns bool for each item in searchList as an array
export function compareArrays(searchList: any[], response: any[]): boolean[] {

    var boolArray: boolean[] = new Array(20).fill(false);

    log('searchList', searchList);
    log('response', response);


    
    searchList.forEach((searchItem) => {
        response.forEach((responseItem) => {
            log('responseItem', responseItem.c[0].f);
            if (searchItem === responseItem.c[0].f) {
                boolArray[searchList.indexOf(searchItem)] = true;
                response.splice(response.indexOf(responseItem), 1);
            };
            
        });
    });

    return boolArray;
}