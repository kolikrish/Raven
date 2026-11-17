
import { BRAND } from "../../brand";

// The studio name with its ® set small and raised. The typeface's own ® is drawn at full
// cap height, which reads as a fourth letter in a wordmark.
const BrandMark = () => (
  <>
    {BRAND.name}
    <span aria-hidden className="raven-registered inline-block align-top font-medium leading-[1.4]">
      ®
    </span>
  </>
);

export default BrandMark;
