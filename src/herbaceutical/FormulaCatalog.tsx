import FormulaCatalog from "../components/FormulaCatalog";
import { theme, categories } from "./data";

export default function HerbaceuticalCatalog() {
  return (
    <FormulaCatalog
      theme={theme}
      categories={categories}
      rangeId="herbaceutical"
      scrollClassName="zephyr-scroll-herba"
    />
  );
}
