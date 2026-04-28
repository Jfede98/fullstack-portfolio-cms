const LEAD_ROUTING_CONFIG_POPULATE = {
  fields: ['documentId', 'distributionMode', 'isActive', 'name'],
};

const LEAD_FORM_SELECTION_POPULATE = {
  fields: ['documentId', 'name', 'channel', 'variant', 'isActive', 'automaticFlow'],
  populate: {
    form: {
      populate: {
        icon: true,
        button: {
          populate: {
            icon: true,
          },
        },
        inputs: {
          populate: {
            icon: true,
            options: true,
          },
        },
        privacyCheckbox: true,
        statusMessage: true,
      },
    },
    lead_routing_configs: LEAD_ROUTING_CONFIG_POPULATE,
  },
};

const BUTTON_POPULATE = {
  populate: {
    icon: true,
    lead_form: LEAD_FORM_SELECTION_POPULATE,
  },
};

const PLAN_POPULATE = {
  populate: {
    priceInfo: true,
    ctaButtons: BUTTON_POPULATE,
    benefits: {
      populate: {
        icon: true,
      },
    },
    apps: {
      populate: {
        icon: true,
        custom_icon: {
          populate: {
            image: true,
          },
        },
      },
    },
  },
};

const WIDGET_DYNAMIC_ZONE_POPULATE = {
  on: {
    'block.fa-qs': {
      populate: {
        questions: {
          populate: {
            category: {
              fields: ['name', 'slug']
            }
          }
        },
        availableCategories: {
          fields: ['name', 'slug', 'order']
        },
        highlightCard: {
          populate: {
            icon: true,
            cta: BUTTON_POPULATE,
          },
        },
      },
    },
    'block.cta-banner': {
      populate: {
        backgroundImage: true,
        title: true,
        cta: BUTTON_POPULATE,
        features: {
          populate: {
            icon: true,
          },
        },
      },
    },
    'block.features': {
      populate: {
        title: true,
        mainItems: {
          populate: {
            button: BUTTON_POPULATE,
          },
        },
      },
    },
    'block.map': true,
  },
};

const WIDGET_RELATION_POPULATE = {
  fields: ['documentId', 'name'],
  populate: {
    widget: WIDGET_DYNAMIC_ZONE_POPULATE,
  },
};

const HERO_SLIDE_POPULATE = {
  populate: {
    banner: {
      populate: {
        bannerDesktop: {
          populate: {
            title: true,
            subtitle: true,
            img: true,
            cta: BUTTON_POPULATE,
          },
        },
        bannerMobile: {
          populate: {
            title: true,
            subtitle: true,
            img: true,
            cta: BUTTON_POPULATE,
          },
        },
      },
    },
    features: {
      populate: {
        button: BUTTON_POPULATE,
      },
    },
    avatar: true,
    lead_form: LEAD_FORM_SELECTION_POPULATE,
  },
};

const SERVICE_CHANNELS_POPULATE = {
  populate: {
    title: true,
    attentionCard: {
      populate: {
        button: BUTTON_POPULATE,
        icon: true,
      },
    },
    shortcuts: {
      populate: {
        items: {
          populate: {
            icon: true,
          },
        },
      },
    },
  },
};

export const PAGE_POPULATE = {
  seo: {
    populate: {
      metaImage: true,
      openGraph: {
        populate: {
          ogImage: true,
        },
      },
    },
  },
  section: {
    on: {
      'block.testimonials': {
        populate: {
          title: true,
          ctaButton: BUTTON_POPULATE,
          testimonials: true,
          features: {
            populate: {
              icon: true,
            },
          },
        },
      },
      'block.hero': {
        populate: {
          slides: HERO_SLIDE_POPULATE,
          overlayWidget: WIDGET_RELATION_POPULATE,
          overlayLeadForm: LEAD_FORM_SELECTION_POPULATE,
        },
      },
      'block.widget': {
        populate: {
          widgets: WIDGET_RELATION_POPULATE,
        },
      },
      'block.plan-tab': {
        populate: {
          categories: {
            populate: {
              icon: true,
              title: true,
              plans: PLAN_POPULATE,
            },
          },
          gridRules: true,
        },
      },
      'block.service-channels': SERVICE_CHANNELS_POPULATE,
      'block.streaming-plans': {
        populate: {
          title: true,
          subtitle: true,
          plans: {
            populate: {
              image: true,
              ctas: BUTTON_POPULATE,
            },
          },
        },
      },
      'block.comparative-table': {
        populate: {
          title: true,
          subtitle: true,
          comparative: true,
          titleTable: true,
          sections: {
            populate: {
              buttons: BUTTON_POPULATE,
              activeStatus: true,
            },
          },
        },
      },
      'block.informational-section': {
        populate: {
          title: true,
          subtitle: true,
          image: true,
          button: BUTTON_POPULATE,
        },
      },
      'block.info-card-block': {
        populate: {
          cards: {
            populate: {
              image: true,
            },
          },
        },
      },
      'block.list-card-block': {
        populate: {
          cards: true,
        },
      },
      'block.contact-form-block': {
        populate: {
          leadForm: LEAD_FORM_SELECTION_POPULATE,
        },
      },
      'block.link-block': {
        populate: {
          link: true,
        },
      },
      'block.two-columns': {
        populate: {
          leftContentType: {
            populate: {
              lead_form: LEAD_FORM_SELECTION_POPULATE,
              widget: WIDGET_RELATION_POPULATE,
            },
          },
          rightContentType: {
            populate: {
              lead_form: LEAD_FORM_SELECTION_POPULATE,
              widget: WIDGET_RELATION_POPULATE,
            },
          },
        },
      },
      'block.dual-buttons': {
        populate: {
          title: true,
          primaryButton: BUTTON_POPULATE,
          secondaryButton: BUTTON_POPULATE,
          backgroundImage: true,
        },
      },
      'block.banner-link-block': {
        populate: {
          banner: {
            populate: {
              bannerDesktop: {
                populate: {
                  title: true,
                  subtitle: true,
                  img: true,
                  cta: BUTTON_POPULATE,
                },
              },
              bannerMobile: {
                populate: {
                  title: true,
                  subtitle: true,
                  img: true,
                  cta: BUTTON_POPULATE,
                },
              },
            },
          },
        },
      },
      'block.fa-qs': {
        populate: {
          questions: {
            populate: {
              category: {
                fields: ['name', 'slug']
              }
            }
          },
          availableCategories: {
            fields: ['name', 'slug', 'order']
          },
          highlightCard: {
            populate: {
              icon: true,
              cta: BUTTON_POPULATE,
            },
          },
        },
      },
      'block.map': true,
      'block.centers-page-block': {
        populate: {
          cities: true,
          services: true,
          mapConfig: true,
          centers: {
            populate: {
              image: true,
              services: true,
              mapButton: BUTTON_POPULATE,
              servicesButton: BUTTON_POPULATE,
              navigationButton: BUTTON_POPULATE,
            },
          },
        },
      },
      'block.form': {
        populate: {
          icon: true,
          inputs: {
            populate: {
              icon: true,
              options: true,
            },
          },
          button: BUTTON_POPULATE,
          privacyCheckbox: true,
          statusMessage: true,
        },
      },
      'block.features': {
        populate: {
          title: true,
          mainItems: {
            populate: {
              button: BUTTON_POPULATE,
            },
          },
        },
      },
      'block.cta-banner': {
        populate: {
          backgroundImage: true,
          title: true,
          cta: BUTTON_POPULATE,
          features: {
            populate: {
              icon: true,
            },
          },
        },
      },
      'block.shortcuts': {
        populate: {
          items: {
            populate: {
              icon: true,
            },
          }
        },
      },
    },
  },
};
