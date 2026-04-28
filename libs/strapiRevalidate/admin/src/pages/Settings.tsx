import React, { useState, useEffect } from 'react';
import {
  Main,
  Box,
  Card,
  CardBody,
  Flex,
  TextInput,
  Button,
  Typography,
  Field,
} from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { Check, Eye, EyeStriked } from '@strapi/icons';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    frontendUrl: '',
    authToken: '',
    frontendProdUrl: '',
    authProdToken: '',
  });
  const [showToken, setShowToken] = useState(false);
  const [showProdToken, setShowProdToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { get, put } = useFetchClient();
  const { toggleNotification } = useNotification();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await get('/strapi-revalidate/settings');
        if (data?.data) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, [get]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await put('/strapi-revalidate/settings', settings);
      toggleNotification({
        type: 'success',
        message: 'Configuración guardada correctamente',
      });
    } catch (err) {
      console.error('Error saving settings:', err);
      toggleNotification({
        type: 'danger',
        message: 'Error al guardar la configuración',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Main>
      <form onSubmit={handleSubmit}>
        <Box padding={8} background="neutral100">
          <Flex justifyContent="space-between" alignItems="flex-end" paddingBottom={6}>
            <Box>
              <Typography variant="epsilon" textColor="neutral600">
                Configura la URL y el token de autorización para la revalidación del frontend.
              </Typography>
            </Box>
            <Button type="submit" startIcon={<Check />} loading={isSaving}>
              Guardar
            </Button>
          </Flex>

          <Card>
            <CardBody>
              <Flex direction="column" alignItems="stretch" gap={4}>
                <Box>
                  <Typography variant="beta">Staging (STG)</Typography>
                </Box>

                <Field.Root name="frontendUrl">
                  <Field.Label>Frontend API Revalidate URL</Field.Label>
                  <TextInput
                    placeholder="Frontend URL API Revalidate"
                    name="frontendUrl"
                    onChange={handleChange}
                    value={settings.frontendUrl}
                  />
                  <Typography variant="pi" textColor="neutral600">
                    La URL base frontend donde se enviará la petición de revalidación.
                  </Typography>
                </Field.Root>

                <Field.Root name="authToken">
                  <Field.Label>Authorization Token</Field.Label>
                  <TextInput
                    type={showToken ? 'text' : 'password'}
                    name="authToken"
                    placeholder="Ingresa el token secreto"
                    onChange={handleChange}
                    value={settings.authToken}
                    endAction={
                      <button
                        onClick={() => setShowToken((s) => !s)}
                        aria-label={showToken ? 'Ocultar token' : 'Mostrar token'}
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 8px',
                          cursor: 'pointer',
                        }}
                      >
                        {showToken ? <EyeStriked /> : <Eye />}
                      </button>
                    }
                  />
                  <Typography variant="pi" textColor="neutral600">
                    Token de seguridad que se enviará en los headers para autorizar la revalidación (STG).
                  </Typography>
                </Field.Root>

                <Box paddingTop={4}>
                  <Typography variant="beta">Producción (PROD)</Typography>
                </Box>

                <Field.Root name="frontendProdUrl">
                  <Field.Label>Frontend API Revalidate URL (PROD)</Field.Label>
                  <TextInput
                    placeholder="Frontend URL API Revalidate PROD"
                    name="frontendProdUrl"
                    onChange={handleChange}
                    value={settings.frontendProdUrl}
                  />
                  <Typography variant="pi" textColor="neutral600">
                    La URL base frontend de producción donde se enviará la petición de revalidación.
                  </Typography>
                </Field.Root>

                <Field.Root name="authProdToken">
                  <Field.Label>Authorization Token (PROD)</Field.Label>
                  <TextInput
                    type={showProdToken ? 'text' : 'password'}
                    name="authProdToken"
                    placeholder="Ingresa el token secreto de producción"
                    onChange={handleChange}
                    value={settings.authProdToken}
                    endAction={
                      <button
                        onClick={() => setShowProdToken((s) => !s)}
                        aria-label={showProdToken ? 'Ocultar token' : 'Mostrar token'}
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 8px',
                          cursor: 'pointer',
                        }}
                      >
                        {showProdToken ? <EyeStriked /> : <Eye />}
                      </button>
                    }
                  />
                  <Typography variant="pi" textColor="neutral600">
                    Token de seguridad que se enviará en los headers para autorizar la revalidación (PROD).
                  </Typography>
                </Field.Root>

              </Flex>
            </CardBody>
          </Card>
        </Box>
      </form>
    </Main>
  );
};

export { SettingsPage };
