import { useState } from 'react';
import { Tab, Tabs } from "react-bootstrap";
import CategoryList from "./CategoryList";
import AddCategory from "./AddCategory";

export default function CategoryHome() {
    const [activeKey, setActiveKey] = useState<string>('categories');

    const goToCategories = () => setActiveKey('categories');

    return (
        <Tabs
            activeKey={activeKey}
            onSelect={(k) => k && setActiveKey(k as string)}
            id="fill-tab-example"
            className="mb-3"
            fill
        >
            <Tab eventKey="categories" title="Categories">
                <CategoryList />
            </Tab>
            <Tab eventKey="addcategory" title="Add Category">
                <AddCategory onCancelNavigate={goToCategories} />
            </Tab>
        </Tabs>
    )
}