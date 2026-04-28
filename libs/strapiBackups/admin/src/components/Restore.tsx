import { Typography, Flex, Button, Dialog } from '@strapi/design-system';
import { WarningCircle } from '@strapi/icons';
import { useRestore } from '../hooks/useRestore';

export const Restore = () => {
  const { handlerSetRestoreDialogOpen, isRestoreDialogOpen, handleConfirmRestore, selectedBackup } =
    useRestore();

  return (
    <Dialog.Root open={isRestoreDialogOpen} onOpenChange={handlerSetRestoreDialogOpen}>
      <Dialog.Content>
        <Dialog.Header>⚠️ Restauración de base de datos</Dialog.Header>
        <Dialog.Body icon={<WarningCircle />}>
          <Flex direction="column" alignItems="center" gap={2}>
            <Flex justifyContent="center">
              <Typography id="confirm-description">
                ¿Estás seguro de que deseas restaurar el punto <b>{selectedBackup}</b>? Este proceso
                eliminará por completo la base de datos actual, la reemplazará con los datos de la
                copia de seguridad y reiniciará automáticamente el servidor de Strapi.
              </Typography>
            </Flex>
            <Flex justifyContent="center" paddingTop={4}>
              <Typography textColor="danger600" variant="omega" fontWeight="bold">
                ⚠️ NO recargar la página hasta que el servidor vuelva a estar en línea. ¡Esperar de
                1 a 2 minutos de inactividad!
              </Typography>
            </Flex>
          </Flex>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button variant="tertiary">Cancelar</Button>
          </Dialog.Cancel>
          <Dialog.Action>
            <Button variant="danger-light" onClick={handleConfirmRestore}>
              Confirmar restauración
            </Button>
          </Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
