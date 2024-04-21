import {GenericPage} from "./generic-page.loader";
import {PlayShow} from "../play-show/play-show.loader";
import {EpisodesPage} from "../episodes-page/episodes-page.loader";
import {AuthInterceptor} from "../../auth-interceptor";
import {HttpService} from "atv-legacy.js/dist/http-service";
import {SportsViewer} from "../sports-video/sports-viewer.loader";

export function load(url: string) {
    new GenericPage(url).loadPage();
}

export function play(showId: string) {
    new PlayShow(showId).loadPage();
}

export function playSport(playbackHref: string) {
    new HttpService(playbackHref, 'GET')
        .interceptor(new AuthInterceptor())
        .header("Content-Type", "application/json")
        .run()
        .then((data) => {
            if (data.statusCode == 200) {
                new SportsViewer(data.body, { title: 'Test' }).loadPage();
            }
        })
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
