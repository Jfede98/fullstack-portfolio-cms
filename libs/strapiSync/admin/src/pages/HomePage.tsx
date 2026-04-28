import React, { useState, useEffect } from 'react';
import {
  Main,
  HeaderLayout,
  ContentLayout,
  GridLayout,
  Box,
  Typography,
  Card,
  CardBody,
  Divider,
  Flex,
  Loader,
  Badge,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useFetchClient } from '@strapi/strapi/admin';
import { getTranslation } from '../utils/getTranslation';
import SyncButton from '../components/SyncButton';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { get } = useFetchClient();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await get('/strapi-sync/settings');
        if (data?.data) {
          setSettings(data.data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [get]);

  return (
    <Main>
      <HeaderLayout
        title={formatMessage({ id: getTranslation('plugin.name') })}
        subtitle="Panel de control de sincronización de datos y assets"
        primaryAction={<SyncButton />}
      />
      <ContentLayout>
        {loading ? (
          <Flex justifyContent="center" padding={10}>
            <Loader>Cargando configuración...</Loader>
          </Flex>
        ) : (
          <Box paddingBottom={10}>
            <Box paddingBottom={4}>
              <Typography variant="beta">Configuración Actual</Typography>
              <Box paddingTop={1}>
                <Typography textColor="neutral600">
                  Resumen de los parámetros configurados para los procesos de sincronización.
                </Typography>
              </Box>
            </Box>

            <GridLayout gap={4}>
              <Card>
                <CardBody>
                  <Box paddingBottom={2}>
                    <Typography variant="sigma" textColor="neutral600">
                      Servidor Remoto
                    </Typography>
                  </Box>
                  <Flex gap={2} alignItems="center">
                    <Typography variant="delta" fontWeight="bold">
                      {settings?.isLocal ? 'Servidor Local' : settings?.destinationIp || 'No configurado'}
                    </Typography>
                    {settings?.isLocal && (
                      <Badge backgroundColor="success100" textColor="success600">
                        Local
                      </Badge>
                    )}
                  </Flex>
                  <Box paddingTop={2}>
                    <Typography variant="pi" textColor="neutral600">
                      {settings?.isLocal
                        ? 'Sincronización en el mismo servidor'
                        : 'Dirección IP del servidor de destino'}
                    </Typography>
                  </Box>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Box paddingBottom={2}>
                    <Typography variant="sigma" textColor="neutral600">
                      Ambiente
                    </Typography>
                  </Box>
                  <Flex gap={2} alignItems="center">
                    <Typography variant="delta" fontWeight="bold">
                      {settings?.destinationEnv?.toUpperCase() || 'No configurado'}
                    </Typography>
                    {!settings?.isLocal && (
                      <Badge backgroundColor="secondary100" textColor="secondary600">
                        SSH
                      </Badge>
                    )}
                  </Flex>
                  <Box paddingTop={2}>
                    <Typography variant="pi" textColor="neutral600">
                      Entorno de destino (Stage)
                    </Typography>
                  </Box>
                </CardBody>
              </Card>
            </GridLayout>

            <Box paddingTop={6} paddingBottom={4}>
              <Divider />
            </Box>

            <GridLayout gap={4}>
              <Box>
                <Typography variant="delta" fontWeight="semiBold">
                  S3 Assets
                </Typography>
                <Box paddingTop={4}>
                  <Card>
                    <CardBody>
                      <Flex direction="column" alignItems="stretch" gap={4}>
                        <Box>
                          <Typography variant="sigma" textColor="neutral600">
                            Origen
                          </Typography>
                          <Box paddingTop={1}>
                            <Typography variant="omega">{settings?.sourceBucketPath}</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="sigma" textColor="neutral600">
                            Destino
                          </Typography>
                          <Box paddingTop={1}>
                            <Typography variant="omega">{settings?.destinationBucketPath}</Typography>
                          </Box>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                </Box>
              </Box>

              <Box>
                <Typography variant="delta" fontWeight="semiBold">
                  CloudFront
                </Typography>
                <Box paddingTop={4}>
                  <Card>
                    <CardBody>
                      <Flex direction="column" alignItems="stretch" gap={4}>
                        <Box>
                          <Typography variant="sigma" textColor="neutral600">
                            Origen
                          </Typography>
                          <Box paddingTop={1}>
                            <Typography variant="omega">{settings?.sourceCloudfrontPath}</Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="sigma" textColor="neutral600">
                            Destino
                          </Typography>
                          <Box paddingTop={1}>
                            <Typography variant="omega">
                              {settings?.destinationCloudfrontPath}
                            </Typography>
                          </Box>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                </Box>
              </Box>
            </GridLayout>
          </Box>
        )}
      </ContentLayout>
    </Main>
  );
};

export { HomePage };