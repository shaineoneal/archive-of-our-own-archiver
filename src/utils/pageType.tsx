import $ from 'jquery';
import { getWorkFromWorksPage } from '../pages/content-script/worksPage';

//if its a work's page
if ($('#workskin').length) {
    getWorkFromWorksPage();
}
