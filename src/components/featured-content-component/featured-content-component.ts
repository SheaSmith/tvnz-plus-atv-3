import {getExpandedRow} from "../../expand-row-helper";
import FeaturedContentComponentTemplate from '!!raw-loader!./featured-content-component.xml';
import {SnipeComponent} from "../snipe-component/snipe-component.loader";
import Handlebars from "handlebars";

let loading = false;

export function expandRow(index: number, parentId: string, nextPage: string, moduleId: string) {
    if (loading)
        return;

    loading = true;
    const parent = document.getElementById(parentId);
    const length = parent.childElements.length;

    if (length - 7 <= index) {
        const snipeComponent = new SnipeComponent();

        snipeComponent.loadTemplate().then((c) => {
            try {
                Handlebars.registerPartial(c.componentKey, c.template);

                getExpandedRow(nextPage, FeaturedContentComponentTemplate, (d) => {
                    const children = d.getElementById(parentId).childElements;

                    children.forEach((child) => {
                        child.removeFromParent();
                        parent.appendChild(child);
                    });

                    document.getElementById(`${parentId}-shelf`).setAttribute("onItemFocused", d.getElementById(`${parentId}-shelf`).getAttribute("onItemFocused"));
                    loading = false;
                });
            }
            catch (e) {
                console.log(e);
                loading = false;
            }
        });
    }
}