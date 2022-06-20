import { Page } from "atv-legacy.js/dist/page";
import GenericPageTemplate from '!!raw-loader!./generic-page.xml';
import Q from "atv-legacy-q";
import {HttpService} from "atv-legacy.js/dist/http-service";
import {AuthInterceptor} from "../../auth-interceptor";
import {HomeComponent} from "../../components/home-component/home-component.loader";
import {HeroComponent} from "../../components/hero-component/hero-component.loader";
import {SnipeComponent} from "../../components/snipe-component/snipe-component.loader";
import {FeaturedContentComponent} from "../../components/featured-content-component/featured-content-component.loader";
import {ItemStripComponent} from "../../components/item-strip-component/item-strip-component.loader";
import {CategoryLayoutComponent} from "../../components/category-layout-component/category-layout-component.loader";
import {CategoryLayoutItemComponent} from "../../components/category-layout-item/category-layout-item.loader";
import {ShowHomeComponent} from "../../components/show-home-component/show-home-component.loader";
import {registerHelpers} from "../../custom-handlebars-helpers";
import Handlebars from "handlebars";
import {
    BandedSlotLayoutComponent
} from "../../components/banded-slot-layout-component/banded-slot-layout-component.loader";

export class GenericPage extends Page {
    protected loadTemplateSource(): Q.Promise<string> {
        const deferred = Q.defer<string>();
        deferred.resolve(GenericPageTemplate);

        return deferred.promise;
    }


    protected renderXml(data?: any) {
        super.renderXml(data);
    }

    constructor(private url: string) {
        super([new HomeComponent(), new HeroComponent(), new SnipeComponent(), new FeaturedContentComponent(), new ItemStripComponent(), new CategoryLayoutComponent(), new CategoryLayoutItemComponent(), new ShowHomeComponent(), new BandedSlotLayoutComponent()]);
    }

    protected loadData(): Q.Promise<any> {
        if (this.url.indexOf("/") != -1) {
            return new HttpService(`https://apis-edge-prod.tech.tvnz.co.nz${this.url}`, "GET")
                .interceptor(new AuthInterceptor())
                .run<any>();
        } else {
            return new HttpService("https://apis-public-prod.tech.tvnz.co.nz/play/v1/graphql", "POST")
                .header("Content-Type", "application/json")
                .body(JSON.stringify({ query: `query {  show (id: ${this.url}) {  id  title  synopsis  availability  message  type  captions  genres  moods  coverImage  tileImage  seasons  episodes  favourited  unwatched  extras  rating {  classification  advisoryWarnings  }  distributor {  image  label  }  brandedChannel {  image  label  }  trailers {  id  type  primaryLabel  secondaryLabel  captions  season  episode  synopsis  image  rating {  classification  advisoryWarnings  }  duration {  total  watched  complete  }  }  smartWatch {  label  video {  id  type  badge  primaryLabel  secondaryLabel  captions  season  episode  synopsis  image  warning  rating {  classification  advisoryWarnings  }  duration {  total  watched  complete  }  schedule {  nearestWindow {  from  to  state  }  windows {  from  to  state  }  }  }  }  sponsors {  label  logo  link  }  analytics {  pageType  screenName  showId  }  }, relatedShows (id: ${this.url}) { id title  synopsis  availability  message  type  captions  genres  moods  coverImage  tileImage  seasons  episodes  favourited } }` }))
                .interceptor(new AuthInterceptor())
                .pipe((body) => {
                    let newBody = JSON.parse(JSON.stringify(body));
                    newBody.layout = { type: 'bigScreenShowHomeLayout' };
                    return newBody;
                })
                .run<any>();
        }

    }

    protected registerCustomHelpers(handlebars: typeof Handlebars) {
        registerHelpers(handlebars);
    }
}