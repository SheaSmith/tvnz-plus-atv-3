import {ProfilePage} from "../profile-page/profile-page.loader";
import {GenericPage} from "../generic-page/generic-page.loader";
import {CategoriesPage} from "../categories-page/categories-page.loader";
import {SearchPage} from "../search/search.loader";

export function navigate(event: ATVNavigateEvent) {
    if (event.navigationItemId == "search") {
        new SearchPage().loadPage(event);
    } else if (event.navigationItemId == "profiles") {
        new ProfilePage().loadPage(undefined, false, true);
    } else if (event.navigationItemId == "/api/v4/stv/play/page/shows") {
        new CategoriesPage(event.navigationItemId).loadPage(event);
    } else {
        new GenericPage(event.navigationItemId).loadPage(event);
    }
}