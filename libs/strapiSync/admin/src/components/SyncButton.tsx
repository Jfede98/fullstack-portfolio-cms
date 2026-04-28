import React, { useState } from 'react';
import { Button, Dialog, Typography } from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { ArrowClockwise } from '@strapi/icons';

export const SyncButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toggleNotification } = useNotification();
  const { post } = useFetchClient();

  const handleSync = async () => {
    setIsOpen(false);
    setLoading(true);
    toggleNotification({
      type: 'warning',
      message: 'Sincronización iniciada. No recargue la página.',
    });

    try {
      const response = await post('/strapi-sync/sync');
      if (response?.data?.ok) {
        toggleNotification({
          type: 'success',
          message: '¡Sincronización terminada!',
          timeout: 5000,
        });
      }
    } catch (err) {
      toggleNotification({
        type: 'danger',
        message: 'Error en la transferencia.',
        timeout: 5000,
      });
    } finally {
      setIsOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        fullWidth
        variant="secondary"
        startIcon={<ArrowClockwise />}
        onClick={() => setIsOpen(true)}
        loading={loading}
      >
        Sincronizar
      </Button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Content>
          <Dialog.Header>Confirmar Acción</Dialog.Header>
          <Dialog.Body>
            <Typography>
              ¡Iniciando Sincronización! Por favor, confirme la acción y no recargue la página o
              realice procesos durante la sincronización. Desea continuar?
            </Typography>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button variant="tertiary">Cancelar</Button>
            </Dialog.Cancel>
            <Button variant="success-light" onClick={handleSync}>
              Entendido, iniciar
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default SyncButton;
