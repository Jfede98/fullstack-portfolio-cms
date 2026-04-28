import { Box } from '@strapi/design-system';
import RevalidateButton from './RevalidateButton';

const RevalidateCard = () => {
  return {
    title: 'REVALIDATE',
    content: (
      <Box paddingTop={2} width="100%">
        <RevalidateButton />
      </Box>
    ),
  };
};

export { RevalidateCard };
