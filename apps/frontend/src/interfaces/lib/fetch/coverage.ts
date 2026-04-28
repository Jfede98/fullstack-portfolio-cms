export type CoverageNode = {
  nodeName: string;
  technology: string;
  isOverlay: string;
};

export type CoverageDataFound = {
  city: string;
  province: string;
  sector: string;
  subSector: string;
  nodes: CoverageNode[];
};

export type CoverageApiResponse = {
  response: true;
  message: string;
  data:
    | {
        code: 0;
        data: CoverageDataFound;
      }
    | {
        code: -1;
        externalTransactionId?: string;
        internalTransactionId?: string;
        message: string;
      };
};

export type CoverageCheckResult = {
  hasCoverage: boolean;
  message: string;
  noCoverageReason?: string;
  latitude: number;
  longitude: number;
  address?: string;
  coverageData?: CoverageDataFound;
  rawResponse?: CoverageApiResponse;
};

