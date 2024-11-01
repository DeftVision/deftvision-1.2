import { Tabs, Tab } from '@mui/material'

export default function DocumentCategoryTabs({ categories, selectedCategory, onSelectedCategory }) {

    return (
        <div>
            <Tabs value={{selectedCategory}} onChange={(e, newValue) => onSelectedCategory(newValue)}>
                {categories.map((category) => (
                    <Tab label={category} value={category} key={category} />
                    ))}
            </Tabs>
        </div>
    );
}