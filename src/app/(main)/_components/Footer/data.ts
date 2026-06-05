import type { ContactItem, SocialLink, FooterLink, FooterData } from "../../_types/footer.types";

export const FOOTER_DATA: FooterData = {
  contactItems: [
    {
      icon: "phone",
      text: "+1 (334) 219-6324",
      href: "tel:+13342196324",
    },
    {
      icon: "mail",
      text: "info@tunedessays.com",
      href: "mailto:info@tunedessays.com",
    },
    {
      icon: "mapPin",
      text: "Hayes Valley, CA US 94117",
      href: null,
    },
  ] satisfies readonly ContactItem[],

  socialLinks: [
    {
      icon:  "facebook",
      label: "Follow us on Facebook",
      href:  "https://www.facebook.com/TunedEssays/",
    },
    {
      icon:  "twitter",
      label: "Follow us on Twitter / X",
      href:  "https://x.com/tunedessays",
    },
    {
      icon:  "instagram",
      label: "Follow us on Instagram",
      href:  "https://www.instagram.com/Tunedessays/",
    },
  ] satisfies readonly SocialLink[],

  legalLinks: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Refund Policy",    href: "/refund-policy" },
  ] satisfies readonly FooterLink[],
};

export const FOOTER_TAGLINE =
  "Professional paper writing services for students and professionals worldwide.";

export const NEWSLETTER_HEADING    = "Stay in the loop";
export const NEWSLETTER_SUBHEADING =
  "Get writing tips, academic guides, and exclusive offers straight to your inbox.";
