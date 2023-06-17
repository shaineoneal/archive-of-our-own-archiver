import $ from 'jquery';
import { getWorkFromWorksPage } from '../pages/worksPage';

//if its a work's page
if ($('#workskin').length) {
    getWorkFromWorksPage();
}