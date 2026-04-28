import {
  Box,
  Typography,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Checkbox,
  Loader,
  Button,
} from '@strapi/design-system';
import { PAGE_SIZE } from '../constants/homepage';
import { useListBackupts } from '../hooks/useListBackupts';

export const ListBackups = () => {
  const {
    loading,
    backups,
    currentPage,
    formatMessage,
    currentBackups,
    handlerSelectBackup,
    selectedBackup,
    totalPages,
    handlePrevPage,
    handleNextPage,
  } = useListBackupts();

  if (loading) {
    return (
      <Flex justifyContent="center" padding={8}>
        <Loader>Cargando backups…</Loader>
      </Flex>
    );
  }

  return (
    <Box background="neutral0" hasRadius shadow="filterShadow" padding={6}>
      <Typography variant="delta" style={{ marginBottom: '16px', display: 'block' }}>
        {formatMessage({ id: 'strapi-backups.list.title', defaultMessage: 'S3 Backups' })}
      </Typography>

      <Table colCount={4} rowCount={backups!.length + 1}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">Seleccionar</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Nombre del archivo</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Fecha</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Hora</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentBackups!.map((backup) => (
            <Tr key={backup.filename}>
              <Td>
                <Checkbox
                  onCheckedChange={() => handlerSelectBackup(backup.filename)}
                  checked={selectedBackup === backup.filename}
                />
              </Td>
              <Td>
                <Typography textColor="neutral800">{backup.filename}</Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">{backup.date}</Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">{backup.hour}</Typography>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {backups!.length === 0 && (
        <Box padding={4}>
          <Typography textAlign="center" variant="pi">
            No se encontraron backups.
          </Typography>
        </Box>
      )}

      {backups!.length > 0 && (
        <Box paddingTop={4}>
          <Flex justifyContent="space-between">
            <Typography variant="pi" textColor="neutral600">
              Mostrando {(currentPage! - 1) * PAGE_SIZE + 1} a{' '}
              {Math.min(currentPage! * PAGE_SIZE, backups!.length)} de {backups!.length} entradas
            </Typography>
            <Flex gap={2}>
              <Button variant="tertiary" onClick={handlePrevPage} disabled={currentPage === 1}>
                Anterior
              </Button>
              <Button
                variant="tertiary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </Flex>
          </Flex>
        </Box>
      )}
    </Box>
  );
};
