// Component mapping for conditional rendering
import ContactUs from "../../../templates/contactUs";
import Cart from "../../Cart";
import Contact from "../contact";

interface ComponentMap {
    [key: string]: {
        component: React.FC<any>;
    };
}

export const component_match_id: ComponentMap = Object.freeze({
    contact: {
        component: Contact,
    },
    cart: {
        component: Cart
    },
    contactus: {
        component: ContactUs
    }
});