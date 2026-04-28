import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  Typography,
  MultiSelect,
  MultiSelectOption,
  Box,
  Flex,
} from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { ArrowClockwise } from '@strapi/icons';

export const RevalidateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetEnv, setTargetEnv] = useState<'stg' | 'prod'>('stg');
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toggleNotification } = useNotification();
  const { post, get } = useFetchClient();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await get('/strapi-revalidate/config');
        if (data?.data?.tags) {
          setAvailableTags(data.data.tags);
        }
      } catch (err) {
        console.error('Error fetching revalidate config:', err);
      }
    };

    fetchConfig();
  }, [get]);

  const handleSync = async () => {
    setIsOpen(false);
    setLoading(true);
    toggleNotification({
      type: 'warning',
      message: `Revalidación iniciada en ${targetEnv.toUpperCase()}.`,
    });

    try {
      console.log(`Iniciando POST a /strapi-revalidate/revalidate (${targetEnv}) con tags:`, selectedTags);
      const response = await post('/strapi-revalidate/revalidate', {
        tags: selectedTags,
        env: targetEnv,
      });

      console.log('Respuesta recibida:', response);
      if (response?.data?.ok) {
        toggleNotification({
          type: 'success',
          message: `¡Revalidación terminada! ${selectedTags.length ? `Tags: ${selectedTags.join(', ')}` : ''}`,
          timeout: 5000,
        });
      }
    } catch (err: any) {
      console.error('Error en fetch:', err);
      toggleNotification({
        type: 'danger',
        message: `Error en la revalidación: ${err?.response?.data?.message || err?.message || 'Error desconocido'}`,
        timeout: 5000,
      });
    } finally {
      setIsOpen(false);
      setLoading(false);
      setSelectedTags([]);
    }
  };

  return (
    <>
      <Flex direction="column" gap={2}>
        <Button
          fullWidth
          variant="secondary"
          startIcon={<ArrowClockwise />}
          onClick={() => {
            setTargetEnv('stg');
            setIsOpen(true);
          }}
          loading={loading && targetEnv === 'stg'}
        >
          Revalidar STG
        </Button>
        <Button
          fullWidth
          variant="default"
          startIcon={<ArrowClockwise />}
          onClick={() => {
            setTargetEnv('prod');
            setIsOpen(true);
          }}
          loading={loading && targetEnv === 'prod'}
        >
          Revalidar PROD
        </Button>
      </Flex>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Content>
          <Dialog.Header>Confirmar Acción</Dialog.Header>
          <Dialog.Body>
            <Box paddingBottom={4}>
              <Typography variant="delta">Tags de revalidación</Typography>
            </Box>

            <Box
              paddingTop={2}
              paddingBottom={2}
              width={{ initial: '80%', large: '100%' }}
              marginLeft="auto"
              marginRight="auto"
            >
              <MultiSelect
                placeholder="Selecciona uno o más tags..."
                onClear={() => setSelectedTags([])}
                value={selectedTags}
                onChange={setSelectedTags}
                withTags
              >
                {availableTags.map((tag) => (
                  <MultiSelectOption key={tag} value={tag}>
                    {tag}
                  </MultiSelectOption>
                ))}
              </MultiSelect>
            </Box>

            <Box paddingTop={4}>
              <Typography variant="pi" fontWeight="bold" textColor="neutral600">
                Nota: Si no seleccionas ninguno, se usarán los tags predeterminados.
              </Typography>
            </Box>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button variant="tertiary">Cancelar</Button>
            </Dialog.Cancel>
            <Button variant="success-light" onClick={handleSync}>
              Iniciar revalidación
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default RevalidateButton;
