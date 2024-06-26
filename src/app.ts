import { initialise } from "atv-legacy.js"
import { LoginPage } from "./pages/login-page/login-page.loader";
import {HttpService} from "atv-legacy.js/dist/http-service";
import {ProfilePage} from "./pages/profile-page/profile-page.loader";
import {MainMenu} from "./pages/main-menu/main-menu.loader";
import {AuthInterceptor} from "./auth-interceptor";
import {registerHelpers} from "./custom-handlebars-helpers";
import PlayShowTemplate from '!!raw-loader!./pages/play-show/play-show.xml';
import {TemplateLoader} from "atv-legacy.js/dist/template-loader";
import {Environment} from "nunjucks";
import { ComponentExtension } from "atv-legacy.js/dist/component-nunjucks";

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

var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // Regular expression to check formal correctness of base64 encoded strings
    b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

var chars = {
    ascii: function () {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    },
    indices: function () {
           let cache = {} as any;
            var ascii = chars.ascii();

            for (var c = 0; c < ascii.length; c++) {
                var chr = ascii[c];
                cache[chr] = c;
            }

            return cache;

    }
};





atv.secureKeyDelivery!.fetchKeys = (uri, requestData, callback) => {
    console.log("Fetching keys...");
    console.log(requestData);
    const sport = atv.player.asset!.getElementByName("stash").getElementByName("sport");
    const keyServerUrl = atv.player.asset!.getElementByName("stash").getElementByName("fpsKeyServerURL").textContent;

    if (sport) {
        new HttpService("https://worker-broad-boat-b2ce.shea9872.workers.dev/", "POST")
            .header('authorization', atv.player.asset!.getElementByName("stash").getElementByName("token").textContent)
            .body(requestData)
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
    else {

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
}

atv.secureKeyDelivery!.fetchAssetID = (uri, callback) => {
    console.log("Fetching asset ID...", uri);
    callback.success(uri.replace("skd://assetId=", "").replace("&variantId=fairplay", ""), false);
}

atv.secureKeyDelivery!.fetchCertificate = (uri, callback) => {
    console.log("Fetching certificate...", uri);
    const certificateUrl = atv.player.asset!.getElementByName("stash").getElementByName("fpsCertificateURL").textContent;
    console.log(certificateUrl)

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
    console.log("generateReq", req.url)
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

                const loader = new TemplateLoader();
                const env = new Environment(loader);
                env.addExtension('component', new ComponentExtension(env));

                registerHelpers(env);

                const xmlString = env.renderString(PlayShowTemplate, data);

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
