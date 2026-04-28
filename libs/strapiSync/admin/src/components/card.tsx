import { Box } from '@strapi/design-system';
import SyncButton from './SyncButton';

const SyncButtonCard = () => {
  return {
    title: 'SYNCRONIZED',
    content: (
      <Box paddingTop={2} width="100%">
        <SyncButton />
      </Box>
    ),
  };
};

export { SyncButtonCard };
