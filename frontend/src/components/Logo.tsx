import { ROUTES } from "@/constants";
import { Cloud } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ icon = false }: { icon?: boolean }) {
  return (
    // TODO: use constant routes enum
    <Link to={ROUTES.ROOT} className="flex items-center gap-2">
      <div className="flex items-center justify-center bg-primary text-white p-2 rounded-lg">
        <Cloud />
      </div>
      {!icon && <p className="font-bold">Local Cloud</p>}
    </Link>
  );
}
