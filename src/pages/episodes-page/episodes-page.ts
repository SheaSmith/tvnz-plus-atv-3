import {PlayShow} from "../play-show/play-show.loader";
import {EpisodesPage} from "./episodes-page.loader";

export function play(showId: string) {
    new PlayShow(showId).loadPage();
}

export function volatileReload(showId: string) {
    new EpisodesPage(showId).loadPage(undefined, false, true);
}