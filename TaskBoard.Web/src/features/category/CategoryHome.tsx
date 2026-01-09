import { Tab, Tabs } from "react-bootstrap";
import CategoryList from "./CategoryList";

export default function CategoryHome() {
    return (
        <Tabs
            defaultActiveKey="categories"
            id="fill-tab-example"
            className="mb-3"
            fill
        >
            <Tab eventKey="categories" title="Categories">
                <CategoryList />
            </Tab>
            <Tab eventKey="addcategory" title="Add Category">
                Add Category
            </Tab>
        </Tabs>
    )
}