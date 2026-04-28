# Sitio Web Xtrim | Release V5
----

Made with 💙 by DT+ ❤️

## Arquitectura (Mermaid - graph.mermaid)

graph TB
  subgraph "Proyecto Frontend (SST)"
      CF[CloudFront<br/>Next.js Site]
      AG[API Gateway<br/>Frontend Infrastructure]
  end
  
  subgraph "VPC Privada"
      LAMBDA[Lambda Proxy<br/>Parte del Frontend<br/>Conectada a VPC]
      STRAPI[Strapi API<br/>Backend en VPC]
  end
  
  CF -->|Requests /api/*| AG
  AG -->|Invoca| LAMBDA
  LAMBDA -->|HTTP Request| STRAPI
  
  style CF fill:#4CAF50
  style AG fill:#2196F3
  style LAMBDA fill:#FF9800
  style STRAPI fill:#F44336
  
  note1[Nota: Lambda está físicamente<br/>en la VPC pero pertenece<br/>al proyecto Frontend]
  LAMBDA -.-> note1
  