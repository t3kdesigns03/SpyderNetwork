import { CameraCategory, categories } from "@/data/cameras";

interface FilterBarProps {
  activeCategory: CameraCategory;
  onCategoryChange: (category: CameraCategory) => void;
}

const FilterBar = ({ activeCategory, onCategoryChange }: FilterBarProps) => {
  return (
    <div className="glass sticky top-16 z-40 border-b border-border">
      <div className="container py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
