import FormulaCatalog from "../components/FormulaCatalog";
import { theme, categories } from "./data";

export default function OrganicCatalog() {
  return (
    <FormulaCatalog
      theme={theme}
      categories={categories}
      rangeId="organic"
      scrollClassName="zephyr-scroll-organic"
    />
  );
}
