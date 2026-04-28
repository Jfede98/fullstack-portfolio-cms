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
  Checkbox,
} from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { Check, Eye, EyeStriked } from '@strapi/icons';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    destinationIp: '',
    destinationEnv: '',
    sourceBucketPath: '',
    destinationBucketPath: '',
    sourceCloudfrontPath: '',
    destinationCloudfrontPath: '',
    isLocal: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { get, put } = useFetchClient();
  const { toggleNotification } = useNotification();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await get('/strapi-sync/settings');
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
      await put('/strapi-sync/settings', settings);
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
                Configura los parámetros para la sincronización de base de datos y assets.
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
                  <Typography variant="beta">Sincronización</Typography>
                </Box>

                {/*TODO: Habilitar cuando se implemente la sincronización local */}
                {/* <Box>
                  <Checkbox
                    onCheckedChange={(value: boolean) =>
                      setSettings((prev) => ({ ...prev, isLocal: value }))
                    }
                    checked={settings.isLocal}
                    name="isLocal"
                  >
                    Sincronización Local
                  </Checkbox>
                  <Box paddingTop={1}>
                    <Typography variant="pi" textColor="neutral600">
                      Activar si la sincronización se realiza en el mismo servidor (omite SSH).
                    </Typography>
                  </Box>
                </Box> */}

                <Field.Root name="destinationIp">
                  <Field.Label>IP Servidor Destino</Field.Label>
                  <TextInput
                    placeholder="44.207.231.64"
                    name="destinationIp"
                    onChange={handleChange}
                    value={settings.destinationIp}
                  />
                  <Typography variant="pi" textColor="neutral600">
                    Dirección IP del servidor remoto de destino.
                  </Typography>
                </Field.Root>

                <Field.Root name="destinationEnv">
                  <Field.Label>Ambiente Destino</Field.Label>
                  <TextInput
                    placeholder="qa"
                    name="destinationEnv"
                    onChange={handleChange}
                    value={settings.destinationEnv}
                  />
                  <Typography variant="pi" textColor="neutral600">
                    Nombre del ambiente de sincronización (ej: qa, prod).
                  </Typography>
                </Field.Root>

                <Field.Root name="sourceBucketPath">
                  <Field.Label>Bucket Origen y Path</Field.Label>
                  <TextInput
                    placeholder="xtrim-assets-stg/assets-admin-xtrim"
                    name="sourceBucketPath"
                    onChange={handleChange}
                    value={settings.sourceBucketPath}
                  />
                  <Typography variant="pi" textColor="neutral600">
                    Nombre del bucket de origen y su ruta interna.
                  </Typography>
                </Field.Root>

                <Field.Root name="destinationBucketPath">
                  <Field.Label>Bucket Destino y Path</Field.Label>
                  <TextInput
                    placeholder="xtrim-assets-prod/pruebasync"
                    name="destinationBucketPath"
                    onChange={handleChange}
                    value={settings.destinationBucketPath}
                  />
                  <Typography variant="pi" textColor="neutral600">
                    Nombre del bucket de destino y su ruta interna.
                  </Typography>
                </Field.Root>

                <Field.Root name="sourceCloudfrontPath">
                  <Field.Label>CloudFront Origen y Path</Field.Label>
                  <TextInput
                    placeholder="d2v6nu3ery768q.cloudfront.net/assets-admin-xtrim"
                    name="sourceCloudfrontPath"
                    onChange={handleChange}
                    value={settings.sourceCloudfrontPath}
                  />
                  <Typography variant="pi" textColor="neutral600">
                    Dominio de CloudFront origen y ruta.
                  </Typography>
                </Field.Root>

                <Field.Root name="destinationCloudfrontPath">
                  <Field.Label>CloudFront Destino y Path</Field.Label>
                  <TextInput
                    placeholder="d1zbh0zoyx3qgr.cloudfront.net/pruebasync"
                    name="destinationCloudfrontPath"
                    onChange={handleChange}
                    value={settings.destinationCloudfrontPath}
                  />
                  <Typography variant="pi" textColor="neutral600">
                    Dominio de CloudFront destino y ruta.
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
