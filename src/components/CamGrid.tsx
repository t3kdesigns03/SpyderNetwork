import { Camera } from "@/data/cameras";
import CamCard from "./CamCard";

interface CamGridProps {
  cameras: Camera[];
}

const CamGrid = ({ cameras }: CamGridProps) => {
  if (cameras.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground font-mono text-sm">No cameras found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cameras.map((camera, index) => (
        <CamCard key={camera.id} camera={camera} index={index} />
      ))}
    </div>
  );
};

export default CamGrid;
