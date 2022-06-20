import {HttpService} from "../../../../../Users/Shea/Documents/Apple TV Framework/library/dist/http-service";
import {AuthInterceptor} from "../../auth-interceptor";
import {GenericPage} from "../generic-page/generic-page.loader";
import {PlayShow} from "../play-show/play-show.loader";

const searchString = atv.sessionStorage.getItem("lastSearch");

if (searchString != undefined) {
    new HttpService(`https://apis-public-prod.tech.tvnz.co.nz/api/v1/stv/play/search?q=${escape(searchString)}&includeTypes=all`, "GET")
        .interceptor(new AuthInterceptor())
        .run<any>()
        .then((res) => {
            const results = res.body.results;

            const elements: atv.Element[] = [];
            results.forEach((result: any) => {
                try {
                    const xml = `<twoLineEnhancedMenuItem id="${escapeXml(result.id)}" onSelect="searchResults.load('${escapeXml(result.type == 'show' ? result.showId : result.id)}')" onPlay="searchResults.play(${escapeXml(JSON.stringify(result.watchAction))})">
                                 <label>${escapeXml(result.title)}</label>
                                    <label2>${escapeXml(result.searchDescription)}</label2>
                                    <image>${escapeXml(result.tileImage.src)}?width=375&amp;height=210</image>
                                    <defaultImage>resource://16x9.png</defaultImage>
                                    <rightLabel>${escapeXml(result.badge != null ? result.badge : '')}</rightLabel>
                                    <accessories>
                                        <arrow/>
                                    </accessories>
                                </twoLineEnhancedMenuItem>`


                    const doc = atv.parseXML(xml);
                    elements.push(doc.rootElement);
                } catch (e) {
                    console.error(e);
                }

            });

            elements.forEach((element) => {
                element.removeFromParent();
                try {
                    document.getElementById("items").appendChild(element);
                } catch (e) {
                    console.log(e);
                }
            });

            if (elements.length == 0) {
                const xml = "<menuSection><header><textDivider><title>No results</title></textDivider></header><items><oneLineMenuItem id=\"noresults\"><label /></oneLineMenuItem></items></menuSection>";
                const doc = atv.parseXML(xml);
                const element = doc.rootElement;
                element.removeFromParent();

                const menuSection = document.getElementById("menuSection");
                document.getElementById("sections").replaceChild(menuSection, element);
            }

            try {
                document.getElementById("loading").removeFromParent();
            }
            catch (e) {
                console.log(e)
            }

        });
} else {
    document.getElementById("loading").removeFromParent();
}

export function load(id: string) {
    new GenericPage(id).loadPage();
}

export function play(watchAction: any) {
    if (watchAction != null && watchAction.videoHref != null) {
        new PlayShow(watchAction.videoHref.split("video/")[1]).loadPage();
    }
}

function escapeXml(unsafe: string) {
    return unsafe.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}