import { Tag, Sample } from "./content.type";
import { PricingCategory } from "./price.type";

export interface Service {
  readonly id:                  string;
  readonly name:                string;
  readonly description:         string | null;
  readonly category_id:         string | null;
  readonly featured:            boolean;
  readonly pricing_category_id: string | null;
  readonly slug:                string;
  readonly is_active:           boolean;
  readonly tags:                readonly Tag[];
  readonly [key: string]:       unknown;
}

export interface FallbackService {
  readonly id:        string;
  readonly name:      string;
  readonly description: string;
  readonly iconEmoji: string;
}

export interface ServiceIconMapping {
  readonly keywords:  readonly string[];
  readonly emoji:     string;
  readonly ariaLabel: string;
}

export interface ServiceCategory {
  readonly id:          string;
  readonly name:        string;
  readonly description: string | null;
  readonly order:       number | null;
  readonly services?:   readonly Service[];
  readonly [key: string]: unknown;
}

export interface ServiceDetails extends Service {
  readonly pricing_category: PricingCategory;
  readonly category: ServiceCategory;
}

export interface RelatedContentResponse {
  readonly services: readonly Service[];
  readonly samples:  readonly Sample[];
}

export interface FetchServicesResponse {
  readonly services: readonly Service[];
}

export interface ServiceCategoryResponse {
  readonly categories: readonly ServiceCategory[];
}
