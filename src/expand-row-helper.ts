import {AuthInterceptor} from "./auth-interceptor";
import {registerHelpers} from "./custom-handlebars-helpers";
import {TemplateLoader} from "atv-legacy.js/dist/template-loader";
import {HttpService} from "atv-legacy.js/dist/http-service";
import {ComponentExtension} from "atv-legacy.js/dist/component-nunjucks";
import {Environment} from "nunjucks";

export function getExpandedRow(nextPage: string, template: string, callback: (doc: atv.Document) => void) {
    new HttpService(`https://apis-public-prod.tech.tvnz.co.nz${nextPage}`, "GET")
        .interceptor(new AuthInterceptor())
        .run()
        .then((res) => {
            const env = new Environment(new TemplateLoader());
            env.addExtension('component', new ComponentExtension(env));

            registerHelpers(env);

            try {
                // Substitute the data
                const templateWithData = env.renderString(template, {module: res.body, embedded: (res.body as any)._embedded});

                callback(atv.parseXML(templateWithData));
            }
            catch (e) {
                console.error(e);
            }
        });
}
