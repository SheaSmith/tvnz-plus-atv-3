import {HttpService} from "atv-legacy.js/dist/http-service";
import {AuthInterceptor} from "../../auth-interceptor";
import {SportsViewer} from "../../pages/sports-video/sports-viewer.loader";

const proxyDoc = new atv.ProxyDocument();
proxyDoc.show()

const id = document.rootElement.getElementByName("dialog").getAttribute("id")

