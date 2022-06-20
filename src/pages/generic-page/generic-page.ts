import {GenericPage} from "./generic-page.loader";
import {PlayShow} from "../play-show/play-show.loader";
import {EpisodesPage} from "../episodes-page/episodes-page.loader";
import {HttpService} from "../../../../../Users/Shea/Documents/Apple TV Framework/library/dist/http-service";
import {AuthInterceptor} from "../../auth-interceptor";

export function load(url: string) {
    new GenericPage(url).loadPage();
}

export function play(showId: string) {
    new PlayShow(showId).loadPage();
}

export function episodes(showId: string) {
    new EpisodesPage(showId).loadPage();
}

export function favourite(showId: string, favourite: boolean) {
    new HttpService("https://apis-public-prod.tech.tvnz.co.nz/play/v1/graphql", "POST")
        .header("Content-Type", "application/json")
        .interceptor(new AuthInterceptor())
        .body(`{"query":"mutation { ${favourite ? 'removeFavouriteShow' : 'addFavouriteShow'} (showId: ${showId}) }"}`)
        .run<any>()
        .then((res) => {
            const element = document.getElementById("favourite").getElementByName("title");
            if ("removeFavouriteShow" in res.body.data) {
                element.textContent = "Favourite";
            } else {
                element.textContent = "Favourited";
            }
        });
}

export function volatileReloadShow(showId: string) {
    new GenericPage(showId).loadPage(undefined, false, true);
}