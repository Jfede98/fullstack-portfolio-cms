import type { Schema, Struct } from "@strapi/strapi";

export interface BlockBannerLinkBlock extends Struct.ComponentSchema {
  collectionName: "components_block_banner_link_blocks";
  info: {
    displayName: "Banner-link-block";
  };
  attributes: {
    banner: Schema.Attribute.Component<"shared.banner", true>;
  };
}

export interface BlockCentersPageBlock extends Struct.ComponentSchema {
  collectionName: "components_block_centers_pages";
  info: {
    description: "Complete block for attention centers page with filters, map and cards";
    displayName: "Centers Page Block";
    icon: "pinMap";
  };
  attributes: {
    centers: Schema.Attribute.Component<"global.attention-center-card", true>;
    cities: Schema.Attribute.Component<"global.input-option", true> &
      Schema.Attribute.Required;
    cityDropdownLabel: Schema.Attribute.String;
    mapConfig: Schema.Attribute.Component<"block.map", false> &
      Schema.Attribute.Required;
    mobileListButtonLabel: Schema.Attribute.String & Schema.Attribute.Required;
    mobileMapButtonLabel: Schema.Attribute.String & Schema.Attribute.Required;
    services: Schema.Attribute.Component<"global.input-option", true> &
      Schema.Attribute.Required;
    servicesFilterTitle: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlockComparativeTable extends Struct.ComponentSchema {
  collectionName: "components_block_comparative_tables";
  info: {
    displayName: "ComparativeTable";
  };
  attributes: {
    comparative: Schema.Attribute.Component<"global.feature-item", true>;
    sections: Schema.Attribute.Component<"shared.plan-section", true>;
    subtitle: Schema.Attribute.Component<"global.typography", false>;
    title: Schema.Attribute.Component<"global.typography", false>;
    titleTable: Schema.Attribute.Component<"global.typography", false>;
  };
}

export interface BlockContactFormBlock extends Struct.ComponentSchema {
  collectionName: "components_block_contact_form_blocks";
  info: {
    displayName: "ContactFormBlock";
  };
  attributes: {
    description: Schema.Attribute.Text;
    leadForm: Schema.Attribute.Relation<"oneToOne", "api::lead-form.lead-form">;
    title: Schema.Attribute.String;
  };
}

export interface BlockCtaBanner extends Struct.ComponentSchema {
  collectionName: "components_block_cta_banners";
  info: {
    displayName: "CtaBanner";
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<"images">;
    cta: Schema.Attribute.Component<"global.button", false>;
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Component<"global.feature", true>;
    horizontalAlignment: Schema.Attribute.Enumeration<["left", "right"]> &
      Schema.Attribute.DefaultTo<"left">;
    layout: Schema.Attribute.Enumeration<["vertical", "horizontal"]> &
      Schema.Attribute.DefaultTo<"vertical">;
    title: Schema.Attribute.Component<"global.typography", false>;
  };
}

export interface BlockDualButtons extends Struct.ComponentSchema {
  collectionName: "components_block_dual_buttons";
  info: {
    displayName: "Dual-buttons";
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<"images">;
    description: Schema.Attribute.Text;
    enableOverlay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    primaryButton: Schema.Attribute.Component<"global.button", false>;
    secondaryButton: Schema.Attribute.Component<"global.button", false>;
    title: Schema.Attribute.Component<"global.typography", false>;
  };
}

export interface BlockFaQs extends Struct.ComponentSchema {
  collectionName: "components_block_fa_qs";
  info: {
    displayName: "FAQs";
  };
  attributes: {
    availableCategories: Schema.Attribute.Relation<
      "manyToMany",
      "api::faq-category.faq-category"
    >;
    featuredSliderTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"Lo m\u00E1s preguntado">;
    highlightCard: Schema.Attribute.Component<"shared.info-card", false>;
    questions: Schema.Attribute.Component<"shared.faq-item", true>;
    searchPlaceholder: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"\u00BFQu\u00E9 necesitas saber?">;
    searchScope: Schema.Attribute.Enumeration<["faq", "global"]> &
      Schema.Attribute.DefaultTo<"faq">;
    showCategories: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlockFeatures extends Struct.ComponentSchema {
  collectionName: "components_block_benefits_sections";
  info: {
    displayName: "Features";
  };
  attributes: {
    layoutVariant: Schema.Attribute.Enumeration<["horizontal", "vertical"]> &
      Schema.Attribute.DefaultTo<"horizontal">;
    mainItems: Schema.Attribute.Component<"global.feature-click", true>;
    title: Schema.Attribute.Component<"global.typography", false>;
  };
}

export interface BlockForm extends Struct.ComponentSchema {
  collectionName: "components_block_forms";
  info: {
    displayName: "Form";
  };
  attributes: {
    button: Schema.Attribute.Component<"global.button", false>;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.Component<"global.icon", false>;
    inputs: Schema.Attribute.Component<"global.input", true>;
    privacyCheckbox: Schema.Attribute.Component<"global.checkbox", false>;
    showBorderLine: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    statusMessage: Schema.Attribute.Component<"global.status-message", true>;
    title: Schema.Attribute.String;
  };
}

export interface BlockHero extends Struct.ComponentSchema {
  collectionName: "components_block_heroes";
  info: {
    displayName: "Hero";
  };
  attributes: {
    autoSlideDelayMs: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<5000>;
    heroOverlaySource: Schema.Attribute.Enumeration<["widget", "lead_form"]> &
      Schema.Attribute.DefaultTo<"lead_form">;
    horizontalFormOnDesktop: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    overlayLeadForm: Schema.Attribute.Relation<
      "oneToOne",
      "api::lead-form.lead-form"
    >;
    overlayWidget: Schema.Attribute.Relation<"oneToOne", "api::widget.widget">;
    showWidgetOnDesktop: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    slides: Schema.Attribute.Component<"navigation.hero-slide", true>;
    variant: Schema.Attribute.Enumeration<["default", "light"]> &
      Schema.Attribute.DefaultTo<"default">;
  };
}

export interface BlockInfoCardBlock extends Struct.ComponentSchema {
  collectionName: "components_block_info_card_blocks";
  info: {
    displayName: "InfoCardBlock";
  };
  attributes: {
    cards: Schema.Attribute.Component<"content.info-card", true>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface BlockInformationalSection extends Struct.ComponentSchema {
  collectionName: "components_block_informational_sections";
  info: {
    displayName: "InformationalSection";
  };
  attributes: {
    button: Schema.Attribute.Component<"global.button", false>;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<"images">;
    subtitle: Schema.Attribute.Component<"global.typography", false>;
    title: Schema.Attribute.Component<"global.typography", false> &
      Schema.Attribute.Required;
  };
}

export interface BlockLinkBlock extends Struct.ComponentSchema {
  collectionName: "components_block_link_blocks";
  info: {
    displayName: "LinkBlock";
  };
  attributes: {
    description: Schema.Attribute.Text;
    link: Schema.Attribute.Component<"shared.link-item", true>;
    title: Schema.Attribute.String;
  };
}

export interface BlockListCardBlock extends Struct.ComponentSchema {
  collectionName: "components_block_list_card_blocks";
  info: {
    displayName: "ListCardBlock";
  };
  attributes: {
    cards: Schema.Attribute.Component<"content.list-card", true>;
    title: Schema.Attribute.String;
  };
}

export interface BlockMap extends Struct.ComponentSchema {
  collectionName: "components_block_maps";
  info: {
    displayName: "Map";
    icon: "pinMap";
  };
  attributes: {
    provider: Schema.Attribute.Enumeration<["google", "mapbox"]>;
    token: Schema.Attribute.String;
  };
}

export interface BlockPlanTab extends Struct.ComponentSchema {
  collectionName: "components_block_plan_cards";
  info: {
    displayName: "PlanTab";
  };
  attributes: {
    categories: Schema.Attribute.Component<"shared.category-tab", true>;
    gridRules: Schema.Attribute.Component<"shared.viewport-rule", true>;
  };
}

export interface BlockServiceChannels extends Struct.ComponentSchema {
  collectionName: "components_block_service_channels";
  info: {
    displayName: "ServiceChannels";
  };
  attributes: {
    attentionCard: Schema.Attribute.Component<"shared.attention-card", true>;
    shortcuts: Schema.Attribute.Component<"block.shortcuts", false>;
    title: Schema.Attribute.Component<"global.typography", false>;
  };
}

export interface BlockShortcuts extends Struct.ComponentSchema {
  collectionName: "components_block_shortcuts";
  info: {
    displayName: "Shortcuts";
  };
  attributes: {
    items: Schema.Attribute.Component<"global.items", true>;
  };
}

export interface BlockStreamingPlans extends Struct.ComponentSchema {
  collectionName: "components_block_streaming_plans";
  info: {
    displayName: "StreamingPlans";
  };
  attributes: {
    plans: Schema.Attribute.Component<"shared.streaming-card", true>;
    subtitle: Schema.Attribute.Component<"global.typography", false>;
    title: Schema.Attribute.Component<"global.typography", false>;
  };
}

export interface BlockTestimonials extends Struct.ComponentSchema {
  collectionName: "components_block_testimonials_sections";
  info: {
    displayName: "Testimonials";
  };
  attributes: {
    ctaButton: Schema.Attribute.Component<"global.button", false>;
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Component<"global.feature", true>;
    testimonials: Schema.Attribute.Relation<
      "oneToMany",
      "api::testimonial.testimonial"
    >;
    title: Schema.Attribute.Component<"global.typography", false>;
  };
}

export interface BlockTwoColumns extends Struct.ComponentSchema {
  collectionName: "components_block_two_columns";
  info: {
    displayName: "TwoColumns";
  };
  attributes: {
    backgroundVariant: Schema.Attribute.Enumeration<["white", "primary-50"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"primary-50">;
    dividerColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<"plugin::dynamic-enumeration.dynamic-field">;
    leftContentType: Schema.Attribute.Component<
      "global.rule-two-column",
      false
    >;
    rightContentType: Schema.Attribute.Component<
      "global.rule-two-column",
      false
    >;
    showDivider: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface BlockWidget extends Struct.ComponentSchema {
  collectionName: "components_block_widgets";
  info: {
    displayName: "Widget";
  };
  attributes: {
    widgets: Schema.Attribute.Relation<"oneToMany", "api::widget.widget">;
  };
}

export interface ContentInfoCard extends Struct.ComponentSchema {
  collectionName: "components_content_info_cards";
  info: {
    displayName: "InfoCard";
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<"images">;
    imageAlt: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ContentListCard extends Struct.ComponentSchema {
  collectionName: "components_content_list_cards";
  info: {
    displayName: "ListCard";
  };
  attributes: {
    items: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface ErrorSemiautomaticError extends Struct.ComponentSchema {
  collectionName: "components_error_semiautomatic_errors";
  info: {
    displayName: "SemiautomaticError";
    icon: "exit";
  };
  attributes: {
    errorMessage: Schema.Attribute.String;
    lead_form: Schema.Attribute.Relation<
      "oneToOne",
      "api::lead-form.lead-form"
    >;
    subtitle: Schema.Attribute.Component<"global.typography", false>;
    title: Schema.Attribute.Component<"global.typography", false>;
  };
}

export interface GlobalAttentionCenterCard extends Struct.ComponentSchema {
  collectionName: "components_global_attention_center_cards";
  info: {
    description: "Card component for attention centers and islands with location and services";
    displayName: "Attention Center Card";
    icon: "pinMap";
  };
  attributes: {
    address: Schema.Attribute.Text & Schema.Attribute.Required;
    city: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<"images">;
    latitude: Schema.Attribute.String & Schema.Attribute.Required;
    longitude: Schema.Attribute.String & Schema.Attribute.Required;
    mapButton: Schema.Attribute.Component<"global.button", false>;
    navigationButton: Schema.Attribute.Component<"global.button", false>;
    schedule: Schema.Attribute.Text & Schema.Attribute.Required;
    services: Schema.Attribute.Component<"global.input-option", true>;
    servicesButton: Schema.Attribute.Component<"global.button", false>;
    serviceType: Schema.Attribute.Enumeration<["centro_experiencia", "isla"]>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface GlobalButton extends Struct.ComponentSchema {
  collectionName: "components_global_buttons";
  info: {
    displayName: "Button";
  };
  attributes: {
    hasIcon: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String;
    icon: Schema.Attribute.Component<"global.icon", false>;
    identifier: Schema.Attribute.Enumeration<
      ["modal", "whatsapp", "simple", "lead", "coverage"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"simple">;
    isExternalHref: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    lead_form: Schema.Attribute.Relation<
      "oneToOne",
      "api::lead-form.lead-form"
    >;
    type: Schema.Attribute.Enumeration<["submit", "button", "link"]> &
      Schema.Attribute.DefaultTo<"button">;
    variant: Schema.Attribute.Enumeration<
      ["primary", "secondary", "tertiary", "outline", "noBorder", "whatsapp"]
    > &
      Schema.Attribute.DefaultTo<"primary">;
  };
}

export interface GlobalCheckbox extends Struct.ComponentSchema {
  collectionName: "components_global_checkboxes";
  info: {
    displayName: "checkbox";
  };
  attributes: {
    label: Schema.Attribute.RichText & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    required: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface GlobalContactField extends Struct.ComponentSchema {
  collectionName: "components_global_contact_fields";
  info: {
    displayName: "contact-field";
  };
  attributes: {
    column: Schema.Attribute.Enumeration<["left", "right", "full"]>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    type: Schema.Attribute.Enumeration<["text", "email", "tel", "textarea"]>;
  };
}

export interface GlobalContactForm extends Struct.ComponentSchema {
  collectionName: "components_global_contact_forms";
  info: {
    displayName: "ContactForm";
  };
  attributes: {
    button: Schema.Attribute.Component<"global.button", false>;
    checkbox: Schema.Attribute.Component<"global.checkbox", false>;
    fields: Schema.Attribute.Component<"global.contact-field", true>;
  };
}

export interface GlobalFeature extends Struct.ComponentSchema {
  collectionName: "components_global_features";
  info: {
    displayName: "Feature";
  };
  attributes: {
    icon: Schema.Attribute.Component<"global.icon", false>;
    name: Schema.Attribute.String;
  };
}

export interface GlobalFeatureClick extends Struct.ComponentSchema {
  collectionName: "components_global_features_clicks";
  info: {
    displayName: "FeatureClick";
  };
  attributes: {
    button: Schema.Attribute.Component<"global.button", false>;
    description: Schema.Attribute.String;
  };
}

export interface GlobalFeatureItem extends Struct.ComponentSchema {
  collectionName: "components_global_feature_items";
  info: {
    displayName: "FeatureItem";
  };
  attributes: {
    description: Schema.Attribute.Text;
    label: Schema.Attribute.String;
  };
}

export interface GlobalIcon extends Struct.ComponentSchema {
  collectionName: "components_global_icons";
  info: {
    displayName: "Icon";
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<["msm", "sm", "md", "lg", "xl", "xxl"]> &
      Schema.Attribute.DefaultTo<"sm">;
    type: Schema.Attribute.Enumeration<["outlined", "rounded", "filled"]> &
      Schema.Attribute.DefaultTo<"outlined">;
  };
}

export interface GlobalInput extends Struct.ComponentSchema {
  collectionName: "components_global_inputs";
  info: {
    displayName: "Input";
  };
  attributes: {
    column: Schema.Attribute.Enumeration<["default", "left", "right", "full"]> &
      Schema.Attribute.DefaultTo<"default">;
    icon: Schema.Attribute.Component<"global.icon", false>;
    label: Schema.Attribute.String;
    maxLength: Schema.Attribute.Integer;
    name: Schema.Attribute.String;
    options: Schema.Attribute.Component<"global.input-option", true>;
    optionsApi: Schema.Attribute.Enumeration<["cities", "addresses"]> &
      Schema.Attribute.DefaultTo<"cities">;
    optionsSource: Schema.Attribute.Enumeration<["static", "api"]> &
      Schema.Attribute.DefaultTo<"static">;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean & Schema.Attribute.Required;
    searchable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    type: Schema.Attribute.Enumeration<
      [
        "email",
        "number",
        "text",
        "tel",
        "combobox",
        "idCard",
        "fingerprintCode"
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface GlobalInputOption extends Struct.ComponentSchema {
  collectionName: "components_global_input_options";
  info: {
    displayName: "InputOption";
  };
  attributes: {
    disabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface GlobalItems extends Struct.ComponentSchema {
  collectionName: "components_global_items";
  info: {
    displayName: "item";
  };
  attributes: {
    href: Schema.Attribute.String;
    icon: Schema.Attribute.Component<"global.icon", false>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
  };
}

export interface GlobalPriceDisplay extends Struct.ComponentSchema {
  collectionName: "components_global_price_displays";
  info: {
    displayName: "PriceDisplay";
  };
  attributes: {
    amount: Schema.Attribute.String;
    legalDisclaimer: Schema.Attribute.String;
    originalPrice: Schema.Attribute.String;
    promoLabel: Schema.Attribute.String;
    taxLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<"+ imp.">;
  };
}

export interface GlobalRuleTwoColumn extends Struct.ComponentSchema {
  collectionName: "components_global_rule_two_columns";
  info: {
    displayName: "RuleTwoColumn";
  };
  attributes: {
    chooseContent: Schema.Attribute.Enumeration<["widget", "lead_form"]> &
      Schema.Attribute.Required;
    lead_form: Schema.Attribute.Relation<
      "oneToOne",
      "api::lead-form.lead-form"
    >;
    widget: Schema.Attribute.Relation<"oneToOne", "api::widget.widget">;
    width: Schema.Attribute.String;
  };
}

export interface GlobalStatusCheck extends Struct.ComponentSchema {
  collectionName: "components_global_status_checks";
  info: {
    displayName: "StatusCheck";
  };
  attributes: {
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface GlobalStatusMessage extends Struct.ComponentSchema {
  collectionName: "components_global_status_messages";
  info: {
    displayName: "StatusMessage";
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<["success", "error", "duplicated"]>;
  };
}

export interface GlobalTypography extends Struct.ComponentSchema {
  collectionName: "components_global_typographies";
  info: {
    displayName: "Typography";
  };
  attributes: {
    tag: Schema.Attribute.Enumeration<
      [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "span",
        "strong",
        "b",
        "em",
        "sub",
        "sup",
        "pre"
      ]
    > &
      Schema.Attribute.DefaultTo<"span">;
    text: Schema.Attribute.Text;
  };
}

export interface NavigationHeroSlide extends Struct.ComponentSchema {
  collectionName: "components_navigation_hero_slides";
  info: {
    displayName: "HeroSlide";
  };
  attributes: {
    avatar: Schema.Attribute.Media<"images">;
    banner: Schema.Attribute.Component<"shared.banner", false>;
    features: Schema.Attribute.Component<"global.feature-click", true>;
    lead_form: Schema.Attribute.Relation<
      "oneToOne",
      "api::lead-form.lead-form"
    >;
    navigationLabel: Schema.Attribute.String;
  };
}

export interface NavigationMenuItem extends Struct.ComponentSchema {
  collectionName: "components_navigation_dropdown_links";
  info: {
    displayName: "MenuItem";
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
    menuItems: Schema.Attribute.Component<"global.items", true>;
    promoCards: Schema.Attribute.Component<"navigation.promo-card", true>;
    titleCards: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<["simple", "list", "cards"]>;
  };
}

export interface NavigationPromoCard extends Struct.ComponentSchema {
  collectionName: "components_navigation_promo_cards";
  info: {
    displayName: "PromoCard";
  };
  attributes: {
    href: Schema.Attribute.String;
    image: Schema.Attribute.Media<"images"> & Schema.Attribute.Required;
    price: Schema.Attribute.Decimal;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    titleHref: Schema.Attribute.String;
  };
}

export interface SharedApp extends Struct.ComponentSchema {
  collectionName: "components_shared_apps";
  info: {
    displayName: "App";
  };
  attributes: {
    custom_icon: Schema.Attribute.Relation<
      "oneToOne",
      "api::custom-icon.custom-icon"
    >;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.Component<"global.icon", false>;
    name: Schema.Attribute.String;
    useCustomIcon: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedAttentionCard extends Struct.ComponentSchema {
  collectionName: "components_shared_attention_cards";
  info: {
    displayName: "AttentionCard";
  };
  attributes: {
    button: Schema.Attribute.Component<"global.button", false>;
    icon: Schema.Attribute.Component<"global.icon", false>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedBanner extends Struct.ComponentSchema {
  collectionName: "components_shared_banners";
  info: {
    displayName: "Banner";
    icon: "landscape";
  };
  attributes: {
    bannerDesktop: Schema.Attribute.Component<"shared.config-banner", false>;
    bannerMobile: Schema.Attribute.Component<"shared.config-banner", false>;
    ctaPosition: Schema.Attribute.Enumeration<["side", "below"]> &
      Schema.Attribute.DefaultTo<"below">;
  };
}

export interface SharedCategoryTab extends Struct.ComponentSchema {
  collectionName: "components_shared_category_tabs";
  info: {
    displayName: "CategoryTab";
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Component<"global.icon", false>;
    label: Schema.Attribute.String;
    plans: Schema.Attribute.Relation<"oneToMany", "api::plan.plan">;
    title: Schema.Attribute.Component<"global.typography", false>;
  };
}

export interface SharedConfigBanner extends Struct.ComponentSchema {
  collectionName: "components_shared_config_banners";
  info: {
    displayName: "ConfigBanner";
  };
  attributes: {
    cta: Schema.Attribute.Component<"global.button", false>;
    enabledOverlay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    img: Schema.Attribute.Media<"images">;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    link: Schema.Attribute.String;
    subtitle: Schema.Attribute.Component<"global.typography", false>;
    title: Schema.Attribute.Component<"global.typography", false>;
    useManualLink: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: "components_shared_faq_items";
  info: {
    displayName: "FaqItem";
  };
  attributes: {
    anchor: Schema.Attribute.String;
    answer: Schema.Attribute.RichText;
    category: Schema.Attribute.String;
    frequently_asked: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    question: Schema.Attribute.Text;
  };
}

export interface SharedFooterColumn extends Struct.ComponentSchema {
  collectionName: "components_shared_footer_columns";
  info: {
    displayName: "FooterColumn";
  };
  attributes: {
    links: Schema.Attribute.Component<"shared.link-item", true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedInfoCard extends Struct.ComponentSchema {
  collectionName: "components_shared_info_cards";
  info: {
    displayName: "InfoCard";
  };
  attributes: {
    cta: Schema.Attribute.Component<"global.button", false>;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Component<"global.icon", false>;
    title: Schema.Attribute.String;
  };
}

export interface SharedInfoItem extends Struct.ComponentSchema {
  collectionName: "components_shared_info_items";
  info: {
    displayName: "InfoItem";
  };
  attributes: {
    content: Schema.Attribute.Text;
    label: Schema.Attribute.String;
  };
}

export interface SharedLinkItem extends Struct.ComponentSchema {
  collectionName: "components_shared_link_items";
  info: {
    displayName: "LinkItem";
  };
  attributes: {
    isButton: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isExternal: Schema.Attribute.Boolean;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: "components_shared_open_graphs";
  info: {
    displayName: "openGraph";
    icon: "project-diagram";
  };
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<"images">;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogType: Schema.Attribute.String;
    ogUrl: Schema.Attribute.String;
  };
}

export interface SharedPlanSection extends Struct.ComponentSchema {
  collectionName: "components_shared_plan_sections";
  info: {
    displayName: "PlanSection";
  };
  attributes: {
    activeStatus: Schema.Attribute.Component<"global.status-check", true>;
    buttons: Schema.Attribute.Component<"global.button", true>;
    label: Schema.Attribute.String;
    prevPrice: Schema.Attribute.String;
    price: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: "components_shared_seos";
  info: {
    displayName: "seo";
    icon: "search";
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<"images">;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    openGraph: Schema.Attribute.Component<"shared.open-graph", false>;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface SharedSocialNetwork extends Struct.ComponentSchema {
  collectionName: "components_shared_social_networks";
  info: {
    displayName: "socialNetwork";
  };
  attributes: {
    href: Schema.Attribute.String;
    logo: Schema.Attribute.Media<"images">;
    target: Schema.Attribute.Enumeration<["_self", "_blank"]> &
      Schema.Attribute.DefaultTo<"_self">;
  };
}

export interface SharedStreamingCard extends Struct.ComponentSchema {
  collectionName: "components_shared_streaming_cards";
  info: {
    displayName: "StreamingCard";
  };
  attributes: {
    badgeText: Schema.Attribute.String;
    ctas: Schema.Attribute.Component<"global.button", true>;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<"images">;
    title: Schema.Attribute.String;
  };
}

export interface SharedViewportRule extends Struct.ComponentSchema {
  collectionName: "components_shared_viewport_rules";
  info: {
    displayName: "ViewportRule";
  };
  attributes: {
    breakpoint: Schema.Attribute.Enumeration<
      ["msm", "sm", "md", "lg", "xl", "xxl"]
    >;
    itemsPerRow: Schema.Attribute.Integer;
  };
}

export interface SharedWhatsAppFloating extends Struct.ComponentSchema {
  collectionName: "components_shared_whats_app_floatings";
  info: {
    displayName: "whatsAppFloating";
  };
  attributes: {
    phoneNumber: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface StepContract extends Struct.ComponentSchema {
  collectionName: "components_step_contracts";
  info: {
    displayName: "Contract";
    icon: "pencil";
  };
  attributes: {};
}

export interface StepCoverage extends Struct.ComponentSchema {
  collectionName: "components_step_coverages";
  info: {
    displayName: "Coverage";
    icon: "earth";
  };
  attributes: {
    content: Schema.Attribute.Component<"block.two-columns", false> &
      Schema.Attribute.Required;
  };
}

export interface StepFinalData extends Struct.ComponentSchema {
  collectionName: "components_step_final_data";
  info: {
    displayName: "FinalData";
    icon: "check";
  };
  attributes: {
    content: Schema.Attribute.Component<"block.two-columns", false> &
      Schema.Attribute.Required;
  };
}

export interface StepInitialData extends Struct.ComponentSchema {
  collectionName: "components_step_initial_data";
  info: {
    displayName: "InitialData";
    icon: "database";
  };
  attributes: {
    content: Schema.Attribute.Component<"block.two-columns", false> &
      Schema.Attribute.Required;
    infoText: Schema.Attribute.String & Schema.Attribute.Required;
    modalText: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface StepPlans extends Struct.ComponentSchema {
  collectionName: "components_step_plans";
  info: {
    displayName: "Plans";
    icon: "book";
  };
  attributes: {
    plan_tab: Schema.Attribute.Component<"block.plan-tab", false>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface StepValidation extends Struct.ComponentSchema {
  collectionName: "components_step_validations";
  info: {
    displayName: "Validation";
    icon: "check";
  };
  attributes: {};
}

declare module "@strapi/strapi" {
  export module Public {
    export interface ComponentSchemas {
      "block.banner-link-block": BlockBannerLinkBlock;
      "block.centers-page-block": BlockCentersPageBlock;
      "block.comparative-table": BlockComparativeTable;
      "block.contact-form-block": BlockContactFormBlock;
      "block.cta-banner": BlockCtaBanner;
      "block.dual-buttons": BlockDualButtons;
      "block.fa-qs": BlockFaQs;
      "block.features": BlockFeatures;
      "block.form": BlockForm;
      "block.hero": BlockHero;
      "block.info-card-block": BlockInfoCardBlock;
      "block.informational-section": BlockInformationalSection;
      "block.link-block": BlockLinkBlock;
      "block.list-card-block": BlockListCardBlock;
      "block.map": BlockMap;
      "block.plan-tab": BlockPlanTab;
      "block.service-channels": BlockServiceChannels;
      "block.shortcuts": BlockShortcuts;
      "block.streaming-plans": BlockStreamingPlans;
      "block.testimonials": BlockTestimonials;
      "block.two-columns": BlockTwoColumns;
      "block.widget": BlockWidget;
      "content.info-card": ContentInfoCard;
      "content.list-card": ContentListCard;
      "error.semiautomatic-error": ErrorSemiautomaticError;
      "global.attention-center-card": GlobalAttentionCenterCard;
      "global.button": GlobalButton;
      "global.checkbox": GlobalCheckbox;
      "global.contact-field": GlobalContactField;
      "global.contact-form": GlobalContactForm;
      "global.feature": GlobalFeature;
      "global.feature-click": GlobalFeatureClick;
      "global.feature-item": GlobalFeatureItem;
      "global.icon": GlobalIcon;
      "global.input": GlobalInput;
      "global.input-option": GlobalInputOption;
      "global.items": GlobalItems;
      "global.price-display": GlobalPriceDisplay;
      "global.rule-two-column": GlobalRuleTwoColumn;
      "global.status-check": GlobalStatusCheck;
      "global.status-message": GlobalStatusMessage;
      "global.typography": GlobalTypography;
      "navigation.hero-slide": NavigationHeroSlide;
      "navigation.menu-item": NavigationMenuItem;
      "navigation.promo-card": NavigationPromoCard;
      "shared.app": SharedApp;
      "shared.attention-card": SharedAttentionCard;
      "shared.banner": SharedBanner;
      "shared.category-tab": SharedCategoryTab;
      "shared.config-banner": SharedConfigBanner;
      "shared.faq-item": SharedFaqItem;
      "shared.footer-column": SharedFooterColumn;
      "shared.info-card": SharedInfoCard;
      "shared.info-item": SharedInfoItem;
      "shared.link-item": SharedLinkItem;
      "shared.open-graph": SharedOpenGraph;
      "shared.plan-section": SharedPlanSection;
      "shared.seo": SharedSeo;
      "shared.social-network": SharedSocialNetwork;
      "shared.streaming-card": SharedStreamingCard;
      "shared.viewport-rule": SharedViewportRule;
      "shared.whats-app-floating": SharedWhatsAppFloating;
      "step.contract": StepContract;
      "step.coverage": StepCoverage;
      "step.final-data": StepFinalData;
      "step.initial-data": StepInitialData;
      "step.plans": StepPlans;
      "step.validation": StepValidation;
    }
  }
}
