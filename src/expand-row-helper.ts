import Handlebars, { HelperOptions } from "handlebars";
import {HttpService} from "../../../Users/Shea/Documents/Apple TV Framework/library/dist/http-service";
import {AuthInterceptor} from "./auth-interceptor";
import {registerHelpers} from "./custom-handlebars-helpers";

export function getExpandedRow(nextPage: string, template: string, callback: (doc: atv.Document) => void) {
    new HttpService(`https://apis-public-prod.tech.tvnz.co.nz${nextPage}`, "GET")
        .interceptor(new AuthInterceptor())
        .run()
        .then((res) => {
            // Register a raw JSON helper
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
            const templateCompiled = Handlebars.compile(template);

            try {
                // Substitute the data
                const templateWithData = templateCompiled({module: res.body, embedded: (res.body as any)._embedded});

                callback(atv.parseXML(templateWithData));
            }
            catch (e) {
                console.error(e);
            }
        });
}