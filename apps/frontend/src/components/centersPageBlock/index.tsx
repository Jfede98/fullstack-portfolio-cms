"use client";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { MapComponent, Dropdown, Typography, AttentionCenterCard } from "@sitio-publico/shared-ui";
import type { ICentersPageBlock } from "@interfaces/components/centersPageBlock";
import { useCenterServices } from "@hooks/useCenterServices";
import { BottomSheet } from "@components/bottomSheet";

// Función para calcular distancia entre dos puntos (fórmula de Haversine)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const CentersPageBlock: FC<ICentersPageBlock> = ({
  title,
  subtitle,
  cityDropdownLabel,
  serviceDropdownLabel,
  servicesFilterTitle,
  cities,
  services,
  mapConfig,
  centers,
  mobileMapButtonLabel,
  mobileListButtonLabel,
  isFirstBlock = false
}) => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  // const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  // const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [showLocationMessage, setShowLocationMessage] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<any | null>(null);
  
  const { openServicesModal } = useCenterServices();

  // Función para obtener la ubicación del usuario
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.log('Geolocalización no soportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // setUserLocation({ lat: latitude, lng: longitude });
        
        // Encontrar la ciudad más cercana
        let closestCity = "";
        let minDistance = Infinity;
        
        centers.forEach(center => {
          const distance = calculateDistance(latitude, longitude, center.latitude, center.longitude);
          if (distance < minDistance) {
            minDistance = distance;
            closestCity = center.city;
          }
        });
        
        // Verificar si la ciudad más cercana tiene centros
        const centersInClosestCity = centers.filter(center => center.city === closestCity);
        
        if (centersInClosestCity.length > 0 && minDistance < 100) { // 100km de radio
          setSelectedCity(closestCity);
          setShowLocationMessage(false);
        } else {
          setShowLocationMessage(true);
        }
      },
      (error) => {
        // setLocationPermissionDenied(true);
        // Retry logic for timeout errors
        if (error.code === 3) { // TIMEOUT
          setTimeout(() => {
            getUserLocation();
          }, 2000);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  // Obtener ubicación al cargar el componente
  useEffect(() => {
    getUserLocation();
  }, [centers]);

  // Listener para clics en markers desde móvil
  useEffect(() => {
    const handleMarkerClickMobile = (event: CustomEvent) => {
      const { marker } = event.detail;
      
      // Encontrar el centro correspondiente
      const center = centers.find(c => 
        c.latitude === marker.latitude && c.longitude === marker.longitude
      );
      
      if (center && isMobile()) {
        setTimeout(() => {
          setSelectedCenter(center);
          setBottomSheetOpen(true);
        }, 800); // Delay para que termine el zoom
      }
    };

    const mapContainer = document.querySelector('[data-map-container]');
    if (mapContainer) {
      mapContainer.addEventListener('markerClickMobile', handleMarkerClickMobile as EventListener);
      return () => {
        mapContainer.removeEventListener('markerClickMobile', handleMarkerClickMobile as EventListener);
      };
    }
    
    // Return empty cleanup function if no container found
    return () => {};
  }, [centers]);



  // Detectar si es móvil
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024; // lg breakpoint
  };

  // Handle marker click for zoom functionality
  const handleMarkerClick = (marker: any, index: number) => {
    // Marker click handled
  };

  // Handle map button click from cards
  const handleMapButtonClick = (latitude: number, longitude: number) => {
    // Encontrar el centro correspondiente
    const center = centers.find(c => c.latitude === latitude && c.longitude === longitude);
    
    // Si es móvil y estamos en vista lista, cambiar a vista mapa primero
    const wasInListView = isMobile() && mobileView === 'list';
    if (wasInListView) {
      setMobileView('map');
      
      // Esperar a que el mapa se renderice completamente antes de hacer zoom
      setTimeout(() => {
        const mapContainer = document.querySelector('[data-map-container]');
        
        if (mapContainer) {
          const event = new CustomEvent('mapZoom', {
            detail: { 
              latitude, 
              longitude, 
              zoom: 16,
              markerData: center ? {
                title: center.title,
                latitude: center.latitude,
                longitude: center.longitude,
                address: center.address,
                navigationButton: center.navigationButton,
                isMobile: isMobile()
              } : null
            }
          });
          mapContainer.dispatchEvent(event);
          
          // Abrir BottomSheet después del zoom
          if (center) {
            setTimeout(() => {
              setSelectedCenter(center);
              setBottomSheetOpen(true);
            }, 1000); // Tiempo para que complete el zoom
          }
        }
      }, 500); // Tiempo para que se renderice el mapa
      
      return; // Salir aquí para evitar ejecutar el código de abajo
    }
    
    // Si ya estamos en vista mapa o es desktop, hacer zoom inmediatamente
    const mapContainer = document.querySelector('[data-map-container]');
    
    if (mapContainer) {
      const event = new CustomEvent('mapZoom', {
        detail: { 
          latitude, 
          longitude, 
          zoom: 16,
          markerData: center ? {
            title: center.title,
            latitude: center.latitude,
            longitude: center.longitude,
            address: center.address,
            navigationButton: center.navigationButton,
            isMobile: isMobile()
          } : null
        }
      });
      mapContainer.dispatchEvent(event);
      
      // Si es móvil, abrir BottomSheet después del zoom
      if (isMobile() && center) {
        setTimeout(() => {
          setSelectedCenter(center);
          setBottomSheetOpen(true);
        }, 800);
      }
    }
  };

  // Funciones para BottomSheet
  const handleBottomSheetClose = () => {
    setBottomSheetOpen(false);
    setSelectedCenter(null);
  };

  const handleDirectionsClick = (href: string) => {
    window.open(href, '_blank');
    handleBottomSheetClose();
  };

  const handleBottomSheetServicesClick = (services: string[]) => {
    if (selectedCenter) {
      openServicesModal(selectedCenter.title, services, selectedCenter.navigationButton);
    }
    handleBottomSheetClose();
  };

  // Convert centers to map markers with filtering
  const filteredCenters = centers.filter(center => {
    // Filter by city
    const cityMatch = !selectedCity || center.city === selectedCity;
    
    // Filter by services (AND logic - center must have ALL selected services)
    const servicesMatch = selectedServices.length === 0 || 
      selectedServices.every(service => center.services?.includes(service));
    
    return cityMatch && servicesMatch;
  });

  const mapMarkers = filteredCenters.map(center => ({
    longitude: center.longitude,
    latitude: center.latitude,
    title: center.title,
    address: center.address,
    navigationButton: center.navigationButton,
    color: "#1B263B" // Color único ya que no hay filtro de tipo
  }));

  const enhancedMapConfig = {
    ...mapConfig,
    markers: mapMarkers,
    onMarkerClick: handleMarkerClick
  };



  return (
    <div className={`w-full ${isFirstBlock ? 'pt-[120px]' : ''} pb-[50px]`} data-block-type="centers-page-block">
      {/* Filters Section */}
      <div className="w-full bg-white p-6 rounded-lg mb-6">
        <div className="text-center md:text-center mb-6">
          {title && (
            <h1 className="text-[26px] md:text-4xl lg:text-4xl font-bold text-[#1B263B] mb-4 text-left md:text-center">
              {title}
            </h1>
          )}
          
          {subtitle && (
            <Typography
              tag="h3"
              variant="body"
              type="regular"
              className={{
                base: "text-[#6A7180] text-lg md:text-lg lg:text-xl max-w-[600px] mx-auto text-left md:text-center"
              }}
            >
              {subtitle}
            </Typography>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-[600px]">
            <Dropdown
              hiddenArrowIcon={true}
              trigger={
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left cursor-pointer flex items-center justify-between">
                  <span className={selectedCity ? "text-gray-900" : "text-gray-500"}>
                    {selectedCity || cityDropdownLabel || "Seleccionar ciudad"}
                  </span>
                  <svg 
                    className="w-5 h-5 text-gray-400 transition-transform duration-200"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              }
              content={
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {selectedCity && (
                    <div
                      data-dropdown-item
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-500 border-b border-gray-100"
                      onClick={() => setSelectedCity("")}
                    >
                      Limpiar selección
                    </div>
                  )}
                  {cities.map((city, index) => (
                    <div
                      key={index}
                      data-dropdown-item
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedCity(city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              }
            />
          </div>

          {/* Services Filter Title */}
          {servicesFilterTitle && (
            <div className="w-full max-w-[600px] text-center mt-4 mb-2">
              <h3 className="text-[#6A7180] font-bold text-lg">
                {servicesFilterTitle}
              </h3>
            </div>
          )}

          {/* Services Filter Buttons */}
          <div className="w-full max-w-[800px] overflow-x-auto">
            <div className="flex justify-center gap-2 min-w-max px-4">
              {services.map((service, index) => {
                const isSelected = selectedServices.includes(service);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedServices(selectedServices.filter(s => s !== service));
                      } else {
                        setSelectedServices([...selectedServices, service]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer text-sm whitespace-nowrap ${
                      isSelected
                        ? "border-[#1B263B] text-[#0D1B2A] bg-[#E0E1DD]"
                        : "border-[#DBDBDC] text-[#1B263B] bg-white hover:border-[#1B263B]"
                    }`}
                  >
                    {service}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de ubicación cuando no hay centros en la ciudad del usuario */}
      {showLocationMessage && (
        <div className="w-full p-4 mb-6">
          {/* Desktop version */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#64FFDA] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="text-left">
                <div className="text-[#6A7180] font-medium leading-relaxed">
                  <div>Estamos trabajando para llegar a tu ciudad.</div>
                  <div>Por ahora, puedes visitar los centros más cercanos.</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile version */}
          <div className="md:hidden flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#64FFDA] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="text-left">
                <p className="text-[#6A7180] font-medium leading-relaxed">
                  Estamos trabajando para llegar a tu ciudad. Por ahora, puedes visitar los centros más cercanos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-6 min-h-[600px] mb-[18px]">
        <div className="flex-[0.8] max-h-[600px] overflow-y-auto pr-2 bg-white rounded-lg shadow-sm p-4 ml-[5%]">
          <div className="space-y-4">
            {filteredCenters.map((center, index) => (
              <div key={index}>
                <AttentionCenterCard 
                  {...center} 
                  onServicesClick={(services) => openServicesModal(center.title, services, center.navigationButton)}
                  onMapClick={(lat, lng) => handleMapButtonClick(lat, lng)}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-[1.5] min-h-[600px] rounded-lg overflow-hidden shadow-sm bg-white p-2">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <MapComponent {...enhancedMapConfig} />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden mb-[18px]">
        <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 px-4 text-center rounded-md font-medium transition-all duration-200 ${
              mobileView === "map"
                ? "bg-white text-[#1B263B] shadow-sm"
                : "bg-transparent text-gray-600"
            }`}
            onClick={() => setMobileView("map")}
          >
            {mobileMapButtonLabel}
          </button>
          
          <button
            className={`flex-1 py-2 px-4 text-center rounded-md font-medium transition-all duration-200 ${
              mobileView === "list"
                ? "bg-white text-[#1B263B] shadow-sm"
                : "bg-transparent text-gray-600"
            }`}
            onClick={() => setMobileView("list")}
          >
            {mobileListButtonLabel}
          </button>
        </div>

        <div className="h-[500px]">
          {mobileView === "map" ? (
            <div className="w-full h-full rounded-lg overflow-hidden shadow-md bg-white">
              <MapComponent {...enhancedMapConfig} />
            </div>
          ) : (
            <div className="space-y-4 h-full overflow-y-auto bg-white rounded-lg p-4">
              {filteredCenters.map((center, index) => (
                <AttentionCenterCard 
                  key={index} 
                  {...center} 
                  onServicesClick={(services) => openServicesModal(center.title, services, center.navigationButton)}
                  onMapClick={(lat, lng) => handleMapButtonClick(lat, lng)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* BottomSheet para móvil */}
      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={handleBottomSheetClose}
        center={selectedCenter}
        onServicesClick={handleBottomSheetServicesClick}
        onDirectionsClick={handleDirectionsClick}
      />
    </div>
  );
};
