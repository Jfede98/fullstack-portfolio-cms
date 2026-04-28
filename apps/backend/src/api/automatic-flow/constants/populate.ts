const LEAD_ROUTING_CONFIG_POPULATE = {
  fields: ['documentId', 'distributionMode', 'isActive', 'name'],
};

const LEAD_FORM_SELECTION_POPULATE = {
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

const PLAN_TAB_POPULATE = {
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
};

const WIDGET_DYNAMIC_ZONE_POPULATE = {
  on: {
    'block.fa-qs': {
      populate: {
        questions: true,
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
  populate: {
    widget: WIDGET_DYNAMIC_ZONE_POPULATE,
  },
};

const TWO_COLUMNS_CONTENT_POPULATE = {
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
};


export const AUTOMATIC_FLOW_POPULATE = {
  section: {
    on: {
      'step.initial-data': {
        populate: {
          lead_form: LEAD_FORM_SELECTION_POPULATE,
          planTab: PLAN_TAB_POPULATE,
        },
      },
      'step.coverage': {
        populate: {
          content: TWO_COLUMNS_CONTENT_POPULATE,
        },
      },
      // step.contract y step.validation no tienen campos extra por ahora
      'step.contract': true,
      'step.validation': true,
    },
  },
} as const;

