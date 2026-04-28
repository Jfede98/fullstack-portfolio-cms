export enum RevalidateTags {
  ALL = "all",
  MENUS = "menus",
  PAGES = "pages",
  METADATA = "metadata",
  SITEMAP = "sitemap",
  CSP = "csp",
  GLOBAL = "global"
}

export enum CollectionType {
  PAGE = "pages",
  Navbar = "navbar",
  Footer = "footer"
}

export enum PageType {
  HOME = "home"
}

export enum BlockType {
  TESTIMONIALS = "testimonials",
  WIDGET = "widget",
  FORM = "form",
  HERO = "hero",
  CTA_BANNER = "cta-banner",
  PLAN_TAB = "plan-tab",
  FEATURES = "features",
  TWO_COLUMNS = "two-columns",
  SERVICE_CHANNELS = "service-channels",
  COMPARATIVE_TABLE = "comparative-table",
  STREAMING_PLANS = "streaming-plans",
  INFO_CARD_BLOCK = "info-card-block",
  LIST_CARD_BLOCK = "list-card-block",
  CONTACT_FORM_BLOCK = "contact-form-block",
  LINK_BLOCK = "link-block",
  DUAL_BUTTONS = "dual-buttons",
  BANNER_LINK_BLOCK = "banner-link-block",
  FAQS = "fa-qs",
  INFORMATIONAL_SECTION = "informational-section",
  MAP = "map",
  CENTERS_PAGE_BLOCK = "centers-page-block"
}

export enum RenderModalType {
  CONTACT_FORM = "contactForm",
  CONTACT_FORM_STATUS = "contactFormStatus",
  CENTER_SERVICES = "centerServices"
}

export enum FormContactInputType {
  ADDRESS = "address",
  CEDULA = "cedula",
  CITY = "city",
  DOCUMENT = "document",
  PHONE = "phone",
  RUC = "ruc",
  EMAIL = "email"
}

export enum MutationKey {
  ASSISTED_LEAD = "assistedLead",
  CONTACT_FORM = "contactForm",
  FORMS = "forms"
}

export enum FetchingResponseType {
  JSON = "JSON",
  XML = "XML",
  TEXT = "TEXT"
}

//TODO: revisar si se puede eliminar
export enum AssistedLeadChannel {
  SITE_WEB = "69a8638bd56833833dcad398" // id correspondiente a chanel "Sitio Web" otorgado por equipo MAGDATA
}

export enum AssistedLeadErrorCode {
  DUPLICATE = "ERBF009",
  ERROR = "ERROR"
}
