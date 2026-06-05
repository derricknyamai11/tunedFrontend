import { Deadline } from "./content.type";

export interface PricingCategory {
    id: string;
    name: string;
    description: string | null;
    display_order: number;
    readonly [key: string]: unknown;
}

export interface CalculatePriceRequest {
    service_id: string;
    level_id: string;
    deadline: string; ///** ISO 8601, timezone-aware. e.g. "2026-03-17T04:21:33.512894Z" */
    word_count: number;
    page_count: number;
    report_type?: string;
}

export interface CalculatePriceResponse {
    price_per_page: number;
    page_count: number;
    pages_price: number;
    total_price: number;
    deadline_hours: number;
    selected_deadline: Deadline;
}