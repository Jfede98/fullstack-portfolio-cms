export const cloudfrontFunctionRewrite = (prefix: string, stage: string) => {
  const isStaging = stage === 'stg';
  
  const devLogic = isStaging ? `
    const baseUri = uri.includes('dev') ? '/${prefix}-dev' : '/${prefix}';
  ` : `
    const baseUri = '/${prefix}';
  `;

  return `
async function handler(event) {
    const request = event.request;
    const uri = request.uri;

    const handleUriRedirection = (baseUri) => {
        if (uri === baseUri) {
            return {
                statusCode: 301,
                statusDescription: 'Moved Permanently',
                headers: {
                    'location': { value: baseUri + '/' }
                }
            };
        }
        
        if (uri.startsWith(baseUri)) {
            if (uri.endsWith('/') || !uri.includes('.')) {
                request.uri = baseUri + '/index.html';
                return null; // Indica que se modificó el request
            }
        }
        return null;
    };

    if (uri.startsWith('/${prefix}')) {
        ${devLogic}
        const response = handleUriRedirection(baseUri);
        if (response) return response;
    }

    return request;
}`;
};