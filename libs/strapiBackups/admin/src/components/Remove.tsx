import { Typography, Flex, Button, Dialog } from '@strapi/design-system';
import { Plus, Download, WarningCircle, Trash } from '@strapi/icons';
import { useRemove } from '../hooks/useRemove';

export const Remove = () => {
  const { isDeleteDialogOpen, handleConfirmDelete, selectedBackup, handlerSetDeleteDialogOpen } =
    useRemove();

  return (
    <Dialog.Root open={isDeleteDialogOpen} onOpenChange={handlerSetDeleteDialogOpen}>
      <Dialog.Content>
        <Dialog.Header>⚠️ Eliminar backup</Dialog.Header>
        <Dialog.Body icon={<WarningCircle />}>
          <Flex direction="column" alignItems="center" gap={2}>
            <Flex justifyContent="center">
              <Typography id="delete-description">
                ¿Estás seguro de que deseas eliminar el backup <b>{selectedBackup}</b>? Esta acción
                es permanente y no se puede deshacer.
              </Typography>
            </Flex>
          </Flex>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button variant="tertiary">Cancelar</Button>
          </Dialog.Cancel>
          <Dialog.Action>
            <Button variant="danger-light" onClick={handleConfirmDelete}>
              Confirmar eliminación
            </Button>
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
