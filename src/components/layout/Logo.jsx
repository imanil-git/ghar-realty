import { Link } from "react-router";
import Icon from "../ui/Icon";

export default function Logo() {
  return (
    <Link
      to="/"
      aria-label="Ghar Realty home"
      className="inline-flex shrink-0 items-center gap-2 py-2 font-bold tracking-tight"
    >
      <Icon name="home" />
      <span>
        GHAR<span className="hidden sm:inline"> REALTY</span>
      </span>
    </Link>
  );
}
