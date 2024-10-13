import $ from 'jquery';
import { getWorkFromWorksPage } from './worksPage';

//if its a work's page
if ($('#workskin').length) {
    getWorkFromWorksPage();
}
