import { useContext } from "react";
import { ModalContext } from "@context/modal";
import { Typography, Button } from "@sitio-publico/shared-ui";

export const CenterServicesModal = () => {
  const { modalData, handlerState } = useContext(ModalContext);
  const { centerName, services, navigationButton } = modalData || {};

  const handleClose = () => {
    handlerState(false);
  };

  const handleNavigationButtonClick = () => {
    if (navigationButton?.href) {
      // Abrir enlace en nueva pestaña
      window.open(navigationButton.href, '_blank');
    }
    handlerState(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Typography
          tag="h2"
          variant="title"
          type="bold"
          className={{
            base: "text-2xl font-bold text-[#6E3279] mb-2"
          }}
        >
          Servicios Disponibles
        </Typography>
        
        {centerName && (
          <Typography
            tag="h3"
            variant="body"
            type="regular"
            className={{
              base: "text-lg text-gray-600 mb-4"
            }}
          >
            {centerName}
          </Typography>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
        {services && services.length > 0 ? (
          services.map((service: string, index: number) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex items-center justify-center flex-shrink-0">
                <img 
                  src="/assets/svg/check_purple_circle_gray.svg" 
                  alt="check" 
                  className="w-5 h-5" 
                />
              </div>
              <Typography
                tag="span"
                variant="body"
                type="regular"
                className={{
                  base: "text-gray-800 text-sm"
                }}
              >
                {service}
              </Typography>
            </div>
          ))
        ) : (
          <div className="col-span-2">
            <Typography
              tag="p"
              variant="body"
              type="regular"
              className={{
                base: "text-gray-500 italic text-center"
              }}
            >
              No hay servicios disponibles para mostrar.
            </Typography>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex flex-col-reverse md:flex-row md:justify-center gap-3">
        <Button
          color="outline"
          size="md"
          onClick={handleClose}
          className={{
            base: "w-full md:w-auto px-6"
          }}
        >
          Cerrar
        </Button>
        
        {navigationButton && (
          <Button
            color={navigationButton.color || "secondary"}
            size="md"
            onClick={handleNavigationButtonClick}
            className={{
              base: "w-full md:w-auto px-6"
            }}
          >
            {navigationButton.children || "Ver en mapa"}
          </Button>
        )}
      </div>
    </div>
  );
};