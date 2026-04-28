import { Main, Box, Typography, Flex, Button } from '@strapi/design-system';
import { Plus, Download, Trash } from '@strapi/icons';
import { getTranslation } from '../utils/getTranslation';
import { RestoreOverlay } from '../components/RestoreOverlay';
import { useHomePage } from '../hooks/useHomePage';
import { Restore } from '../components/Restore';
import { ListBackups } from '../components/ListBackups';
import { Remove } from '../components/Remove';

const HomePage = () => {
  const {
    formatMessage,
    handleRestoreClick,
    selectedBackup,
    handleCreateBackup,
    isCreating,
    restorePhase,
    isRestoring,
    handlerDeleteClick,
  } = useHomePage();

  return (
    <Main>
      <Box padding={8} background="neutral100">
        <Flex justifyContent="space-between" alignItems="flex-end" paddingBottom={6}>
          <Box>
            <Typography variant="alpha" textColor="neutral800">
              {formatMessage({
                id: getTranslation('plugin.name'),
                defaultMessage: 'Strapi Backups',
              })}
            </Typography>
            <Box>
              <Typography variant="epsilon" textColor="neutral600">
                {formatMessage({
                  id: 'strapi-backups.plugin.subtitle',
                  defaultMessage: 'Manage and restore database backups',
                })}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button
              onClick={handleRestoreClick}
              disabled={!selectedBackup}
              variant="secondary"
              startIcon={<Download />}
              style={{ marginRight: '8px' }}
            >
              Restaurar seleccionado
            </Button>
            <Button
              onClick={handlerDeleteClick}
              disabled={!selectedBackup}
              variant="danger-light"
              startIcon={<Trash />}
              style={{ marginRight: '8px' }}
            >
              Eliminar seleccionado
            </Button>
            <Button onClick={handleCreateBackup} loading={isCreating} startIcon={<Plus />}>
              Crear nuevo backup
            </Button>
          </Box>
        </Flex>

        <ListBackups />
      </Box>

      <Restore />
      <Remove />

      {isRestoring && <RestoreOverlay phase={restorePhase!} />}
    </Main>
  );
};

export { HomePage };
