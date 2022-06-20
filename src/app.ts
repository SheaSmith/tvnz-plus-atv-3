import { initialise } from "atv-legacy.js"
import { LoginPage } from "./pages/login-page/login-page.loader";
import {HttpService} from "atv-legacy.js/dist/http-service";
import {ProfilePage} from "./pages/profile-page/profile-page.loader";
import {MainMenu} from "./pages/main-menu/main-menu.loader";
import {AuthInterceptor} from "./auth-interceptor";
import Handlebars, {HelperOptions} from "handlebars";
import {registerHelpers} from "./custom-handlebars-helpers";
import PlayShowTemplate from '!!raw-loader!./pages/play-show/play-show.xml';
import asset = atv.player.asset;

atv.config.doesJavaScriptLoadRoot = true

atv.onAppEntry = () => {
    //if (atv.localStorage['accessToken'] == null) {
        initialise(new LoginPage());
    //}
}

atv.onAuthenticate = (username, password, callback) => {
    new HttpService("https://apis-public-prod.tech.tvnz.co.nz/api/v1/android/consumer/login", "POST")
        .header("Content-Type", "application/json")
        .body(JSON.stringify({
            'email': username,
            'password': password,
            'keepMeLoggedIn': true
        }))
        .run()
        .then((response) => {
            atv.localStorage.setItem('accessToken', response.headers['aat']);
            callback.success();
        })
        .fail((e) => {
            callback.failure('Invalid username or password');
        });
}

atv.onPageLoad = (id) => {
    if (id == 'dummy-page') {
        new ProfilePage().loadPage(undefined, false, true);
    }
}

atv.onPageUnload = (id) => {
    if (id == 'login-page') {
        if (atv.sessionStorage['profileId'] != null) {
            initialise(new MainMenu());
        }
        else {
            initialise(new ProfilePage());
        }
    }
}

atv.onLogout = () => {
    atv.localStorage.clear();
    atv.sessionStorage.clear();
}

atv.secureKeyDelivery!.fetchKeys = (uri, requestData, callback) => {
    console.log("Fetching keys...");
    const keyServerUrl = atv.player.asset!.getElementByName("stash").getElementByName("fpsKeyServerURL").textContent;

    new HttpService(keyServerUrl, "POST")
        .header("Content-Type", "application/json")
        .body(`{"publisher_id": "1", "application_id": "1", "server_playback_context": "${requestData}"}`)
        .run()
        .then((res) => {
            console.log("Fetched keys successfully");
            callback.success(res.bodyAsBase64);
        })
        .catch((error) => {
            callback.failure("An error occurred. Please try again later.");
            console.error(error);
        });
}

atv.secureKeyDelivery!.fetchAssetID = (uri, callback) => {
    console.log("Fetching asset ID...");
    callback.success(uri.replace("skd://assetId=", "").replace("&variantId=fairplay", ""), false);
}

atv.secureKeyDelivery!.fetchCertificate = (uri, callback) => {
    console.log("Fetching certificate...");
    const certificateUrl = atv.player.asset!.getElementByName("stash").getElementByName("fpsCertificateURL").textContent;

    new HttpService(certificateUrl, "GET")
        .run()
        .then((res) => {
            console.log("Fetched certifcate successfully");
            callback.success(res.bodyAsBase64);
        })
        .catch((error) => {
            callback.failure("An error occurred. Please try again later.");
            console.error(error);
        });
}

atv.player.playerStateChanged = (state: atv.player.states, playheadLocation: number) => {
    recordDurationWatched(playheadLocation);
}

function recordDurationWatched(seconds: number) {
    if (atv.player?.asset) {
        const secondsInt = Math.floor(seconds);
        new HttpService(`https://apis-public-prod.tech.tvnz.co.nz/api/v2/stv/play/video/${atv.player.asset!.getElementByName("externalAssetID").textContent}/recordDurationWatched`, "POST")
            .header("Content-Type", "application/json")
            .interceptor(new AuthInterceptor())
            .body(`{"duration": "PT${secondsInt}S"}`)
            .run()
    }
}

atv.onGenerateRequest = (req) => {
    if (req.url.indexOf("search-results-page.xml") != -1) {
        const searchTerm = req.url.substring(req.url.indexOf("?q=")).replace("?q=", "");
        atv.sessionStorage.setItem("lastSearch", searchTerm);
    }
}

atv.player.loadRelatedPlayback = (upNextAsset, callback) => {
    if (atv.player.asset == null) {
        callback.failure("Player not yet loaded");
        return;
    }

    if (atv.player.asset?.getElementByName("externalAssetID") == null) {
        callback.success(null);
        return;
    }

    const assetId = atv.player.asset?.getElementByName("externalAssetID").textContent;
    new HttpService("https://apis-public-prod.tech.tvnz.co.nz/play/v1/graphql", "POST")
        .header("Content-Type", "application/json")
        .interceptor(new AuthInterceptor())
        .body(`{ "query": "query {  nextEpisode (id: ${assetId}) {  id primaryLabel, synopsis, image, duration { watched total } playback { bcPayload }}  }" }`)
        .pipe((body) => {
            let newBody = JSON.parse(JSON.stringify(body));
            console.log(JSON.stringify(newBody));
            if (newBody.data.nextEpisode.length != 0) {
                newBody.data.nextEpisode[0].playback.bcPayload = JSON.parse(newBody.data.nextEpisode[0].playback.bcPayload);
            }
            return newBody;
        })
        .run<any>()
        .then((res) => {
            if (res.body.data.nextEpisode.length != 0) {
                const data = {
                    data: {
                        video: res.body.data.nextEpisode[0]
                    }
                }

                if (res.body.data.nextEpisode[0].id == assetId) {
                    callback.success(null);
                    return;
                }

                Handlebars.registerHelper('json', (context) => {
                    return JSON.stringify(context);
                });
                Handlebars.registerHelper('ifCond', (arg1, arg2, arg3, options: HelperOptions) => {
                    switch (arg2) {
                        case '==':
                            // @ts-ignore
                            return (arg1 == arg3) ? options.fn(this) : options.inverse(this);
                        case '===':
                            // @ts-ignore
                            return (arg1 === arg3) ? options.fn(this) : options.inverse(this);
                        case '!=':
                            // @ts-ignore
                            return (arg1 != arg3) ? options.fn(this) : options.inverse(this);
                        case '!==':
                            // @ts-ignore
                            return (arg1 !== arg3) ? options.fn(this) : options.inverse(this);
                        case '<':
                            // @ts-ignore
                            return (arg1 < arg3) ? options.fn(this) : options.inverse(this);
                        case '<=':
                            // @ts-ignore
                            return (arg1 <= arg3) ? options.fn(this) : options.inverse(this);
                        case '>':
                            // @ts-ignore
                            return (arg1 > arg3) ? options.fn(this) : options.inverse(this);
                        case '>=':
                            // @ts-ignore
                            return (arg1 >= arg3) ? options.fn(this) : options.inverse(this);
                        case '&&':
                            // @ts-ignore
                            return (arg1 && arg3) ? options.fn(this) : options.inverse(this);
                        case '||':
                            // @ts-ignore
                            return (arg1 || arg3) ? options.fn(this) : options.inverse(this);
                        default:
                            // @ts-ignore
                            return options.inverse(this);
                    }
                });

                registerHelpers(Handlebars);

                // Compile the template.
                const templateCompiled = Handlebars.compile(PlayShowTemplate);

                const xmlString = templateCompiled(data);

                const upNextElement = atv.parseXML(xmlString).getElementById("asset");

                const parentXmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><atv><body><relatedPlayback><upNextItem id=\"upNext\"></upNextItem></relatedPlayback></body></atv>";
                const document = atv.parseXML(parentXmlString);
                upNextElement.removeFromParent();
                document.getElementById("upNext").appendChild(upNextElement);

                callback.success(document);
            }
        })
}

// atv.player.loadRelatedPlayback = (upNextAsset, callback) => {
//     console.log("Load related", upNextAsset);
//
//     new HttpService("https://tvnz-appletv.shea.nz/upnext.xml", "GET")
//         .run<string>()
//         .then((resp) => callback.success(atv.parseXML(resp.body)));
// }
