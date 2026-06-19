package com.vitivinicolas.backend.service;

import com.vitivinicolas.backend.model.GuiaAlmacen;
import com.vitivinicolas.backend.dto.ProductoDTO;
import com.vitivinicolas.backend.repository.GuiaAlmacenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class GuiaAlmacenService {

    @Autowired
    private GuiaAlmacenRepository staticGuiaRepository;

    @Autowired
    private WebClient inventoryWebClient; // Conectado a http://localhost:8081

    /**
     * 🔄 Listar guías locales
     */
    public List<GuiaAlmacen> listarTodas() {
        return staticGuiaRepository.findAll();
    }

    /**
     * 🔄 Guardar operación unificando stocks remotos
     */
    public GuiaAlmacen guardar(GuiaAlmacen staticGuia) {
        int cantidadMovimiento = 0;

        // 1. Validar y parsear la cantidad enviada en el campo encargado
        try {
            cantidadMovimiento = Integer.parseInt(staticGuia.getEncargado().trim());
        } catch (NumberFormatException e) {
            throw new RuntimeException("La cantidad enviada en el campo 'encargado' (" + staticGuia.getEncargado() + ") no es un número válido.");
        }

        try {
            // 2. EVALUAR SI ES PRODUCTO NUEVO O EXISTENTE
            if (staticGuia.getMotivo().contains("Cat:")) {
                // Caso: PRODUCTO NUEVO
                String nombreNuevo = extraerDato(staticGuia.getMotivo(), "Prod:").trim();
                
                ProductoDTO nuevoProducto = new ProductoDTO();
                nuevoProducto.setNombre(nombreNuevo.equals("N/A") ? "Nuevo Vino Registrado" : nombreNuevo);
                nuevoProducto.setCategoria(extraerDato(staticGuia.getMotivo(), "Cat:"));
                nuevoProducto.setUbicacion(extraerDato(staticGuia.getMotivo(), "Ubic:"));
                nuevoProducto.setStock(cantidadMovimiento);
                nuevoProducto.setCodigo("VIN-" + String.format("%03d", (int)(Math.random() * 900) + 100));

                // POST Remoto al inventario usando la ruta completa
                inventoryWebClient.post()
                        .uri("/api/productos")
                        .body(Mono.just(nuevoProducto), ProductoDTO.class)
                        .retrieve()
                        .bodyToMono(ProductoDTO.class)
                        .block();

            } else {
                // Caso: PRODUCTO EXISTENTE (Licor de Naranja, Malbec, etc)
                String nombreLimpio = extraerDato(staticGuia.getMotivo(), "Prod:").trim();
                System.out.println("🚀 Buscando en inventario remoto el producto exacto: [" + nombreLimpio + "]");
                
                // 🎯 RUTA CORREGIDA: Apunta exactamente al endpoint mapeado en tu Inventario
                ProductoDTO producto = inventoryWebClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/api/productos/buscar-por-nombre")
                                .queryParam("nombre", nombreLimpio)
                                .build())
                        .retrieve()
                        .onStatus(status -> status.is4xxClientError(), response -> 
                            Mono.error(new RuntimeException("El producto '" + nombreLimpio + "' no existe en el catálogo de inventario (404).")))
                        .onStatus(status -> status.is5xxServerError(), response -> 
                            Mono.error(new RuntimeException("Error interno en el servidor de inventario (500).")))
                        .bodyToMono(ProductoDTO.class)
                        .block();

                if (producto == null) {
                    throw new RuntimeException("El microservicio de inventario devolvió un objeto vacío para: " + nombreLimpio);
                }

                // 3. MODIFICAR STOCK SEGÚN EL TIPO DE MOVIMIENTO
                String tipo = staticGuia.getTipoMovimiento();
                if (tipo.equalsIgnoreCase("Compra") || tipo.equalsIgnoreCase("Ingreso") || tipo.equalsIgnoreCase("INGRESO")) {
                    producto.setStock(producto.getStock() + cantidadMovimiento);
                } else if (tipo.equalsIgnoreCase("Venta") || tipo.equalsIgnoreCase("Salida") || tipo.equalsIgnoreCase("SALIDA")) {
                    if (producto.getStock() < cantidadMovimiento) {
                        throw new RuntimeException("Stock insuficiente en Inventario para " + nombreLimpio + ". Disponible: " + producto.getStock());
                    }
                    producto.setStock(producto.getStock() - cantidadMovimiento);
                }
                
                System.out.println("💾 Actualizando stock del producto ID: " + producto.getId() + " a un nuevo valor de: " + producto.getStock());

                // 4. ENVIAR PUT REMOTO PARA ACTUALIZAR EL NUEVO STOCK EN EL INVENTARIO
                inventoryWebClient.put()
                        .uri("/api/productos/{id}", producto.getId())
                        .body(Mono.just(producto), ProductoDTO.class)
                        .retrieve()
                        .bodyToMono(ProductoDTO.class)
                        .block();
            }

            // 5. GUARDAR EN LA BASE DE DATOS LOCAL
            return guardarLocal(staticGuia);

        } catch (Exception e) {
            System.err.println("❌ EXCEPCIÓN EN GUIA-SERVICE: " + e.getMessage());
            throw new RuntimeException("Fallo de comunicación entre microservicios: " + e.getMessage());
        }
    }

    @Transactional
    public GuiaAlmacen guardarLocal(GuiaAlmacen staticGuia) {
        return staticGuiaRepository.save(staticGuia);
    }

    @Transactional
    public void eliminar(Long id) {
        staticGuiaRepository.deleteById(id);
    }

    @Transactional
    public GuiaAlmacen actualizar(Long id, GuiaAlmacen staticGuiaDetalles) {
        GuiaAlmacen staticGuia = staticGuiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guía no encontrada con id: " + id));
        staticGuia.setNroGuia(staticGuiaDetalles.getNroGuia());
        staticGuia.setTipoMovimiento(staticGuiaDetalles.getTipoMovimiento());
        staticGuia.setEncargado(staticGuiaDetalles.getEncargado());
        staticGuia.setMotivo(staticGuiaDetalles.getMotivo());
        return staticGuiaRepository.save(staticGuia);
    }

    private String extraerDato(String motivo, String etiqueta) {
        if (motivo == null || !motivo.contains(etiqueta)) return "N/A";
        try {
            String[] partes = motivo.split("\\|");
            for (String parte : partes) {
                if (parte.trim().startsWith(etiqueta)) {
                    return parte.replace(etiqueta, "").trim();
                }
            }
            if (motivo.contains(etiqueta)) {
                return motivo.substring(motivo.indexOf(etiqueta) + etiqueta.length()).trim();
            }
        } catch (Exception e) {
            return "Error al parsear";
        }
        return "N/A";
    }
}