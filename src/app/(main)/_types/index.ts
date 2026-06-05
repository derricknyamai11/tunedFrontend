export type TagId       = string;
export type ServiceId   = string;
export type SampleId    = string;
export type BlogPostId  = string;
export type CategoryId  = string;
export type Slug        = string;

/** ISO-8601 UTC datetime string, e.g. "2026-03-17T04:21:33.512894Z" */
export type ISODateString = string;

export interface Tag {
  readonly id:          TagId;
  readonly name:        string;
  readonly description?: string | null;
  readonly slug:        Slug;
  readonly usage_count: number;
}

export interface Service {
  readonly id:                  ServiceId;
  readonly name:                string;
  readonly description:         string;
  readonly category_id:         CategoryId;
  readonly featured:            boolean;
  readonly pricing_category_id: string;
  readonly slug:                Slug;
  readonly is_active:           boolean;
  readonly tags:                readonly Tag[];
}

export interface ServiceCategory {
  readonly id:                  CategoryId;
  readonly name:                string;
  readonly description:         string;
  readonly order:               number;
}

export interface Sample {
  readonly id:         SampleId;
  readonly title:      string;
  readonly slug:       Slug;
  readonly excerpt:    string | null;
  readonly service_id: ServiceId | null;
  readonly word_count: number;
  readonly featured:   boolean;
  readonly image:      string | null;
  readonly tags:       readonly Tag[];
}

export interface BlogPostResponse {
  readonly id:               BlogPostId;
  readonly title:            string;
  readonly content:          string;
  readonly author:           string;
  readonly category_id:      CategoryId;
  readonly slug:             Slug;
  readonly excerpt:          string;
  readonly featured_image:   string | null;
  readonly meta_description: string | null;
  readonly is_published:     boolean;
  readonly is_featured:      boolean;
  readonly published_at:     ISODateString | null;
  readonly tags:             readonly Tag[];
}

export interface FeaturedContentResponse {
  readonly services: readonly ServiceCategory[];
  readonly samples:  readonly Sample[];
  readonly blogs:    readonly BlogPostResponse[];
}


export interface BlogPostViewModel {
  readonly id:             BlogPostId;
  readonly title:          string;
  readonly author:         string;
  readonly slug:           Slug;
  readonly excerpt:        string;
  readonly featuredImage:  string | null;
  readonly categoryId:     CategoryId;
  readonly tags:           readonly Tag[];
  readonly publishedAt:    ISODateString | null;
  readonly isFeatured:     boolean;
  readonly readTimeMinutes: number;
}

export interface SampleViewModel {
  readonly id:         SampleId;
  readonly title:      string;
  readonly slug:       Slug;
  readonly excerpt:    string | null;
  readonly serviceId:  ServiceId | null;
  readonly wordCount:  number;
  readonly isFeatured: boolean;
  readonly image:      string | null;
  readonly tags:       readonly Tag[];
}
