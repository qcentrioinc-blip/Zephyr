import FormulaCatalog from "../components/FormulaCatalog";
import { theme, categories } from "./data";

export default function NutraceuticalCatalog() {
  return (
    <FormulaCatalog
      theme={theme}
      categories={categories}
      rangeId="nutraceutical"
      scrollClassName="zephyr-scroll-nutra"
    />
  );
}
