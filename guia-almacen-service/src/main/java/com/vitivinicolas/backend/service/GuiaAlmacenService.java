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
    private GuiaAlmacenRepository guiaRepository;

    @Autowired
    private WebClient inventoryWebClient; // El cliente HTTP que creamos en WebClientConfig

    public List<GuiaAlmacen> listarTodas() {
        return guiaRepository.findAll();
    }

    @Transactional
    public GuiaAlmacen guardar(GuiaAlmacen guia) {
        String nombreProducto = extraerDato(guia.getMotivo(), "Prod:");
        int cantidadMovimiento = Integer.parseInt(guia.getEncargado());

        // 1. DETECTAR SI ES PRODUCTO NUEVO O EXISTENTE
        if (guia.getMotivo().contains("Cat:")) {
            // ¡Es un producto nuevo! Construimos el DTO para mandarlo por POST al microservicio de inventario
            ProductoDTO nuevoProducto = new ProductoDTO();
            nuevoProducto.setNombre(nombreProducto);
            nuevoProducto.setCategoria(extraerDato(guia.getMotivo(), "Cat:"));
            nuevoProducto.setUbicacion(extraerDato(guia.getMotivo(), "Ubic:"));
            nuevoProducto.setStock(cantidadMovimiento);
            
            String codigoAutogenerado = "VIN-" + String.format("%03d", (int)(Math.random() * 900) + 100);
            nuevoProducto.setCodigo(codigoAutogenerado);

            // Llamada remota POST
            inventoryWebClient.post()
                    .body(Mono.just(nuevoProducto), ProductoDTO.class)
                    .retrieve()
                    .bodyToMono(ProductoDTO.class)
                    .block(); // .block() hace que espere la respuesta sincrónicamente como en el monolito

        } else {
            // ¡Es un producto existente! Lo buscamos mediante un GET remoto por su nombre
            // IMPORTANTE: Tu inventory-service debe soportar buscar por nombre en su endpoint
            ProductoDTO producto = inventoryWebClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/buscar").queryParam("nombre", nombreProducto).build())
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(), response -> 
                        Mono.error(new RuntimeException("El producto '" + nombreProducto + "' no existe en el inventario remoto.")))
                    .bodyToMono(ProductoDTO.class)
                    .block();

            // 2. Modificar el stock sumando o restando
            if (guia.getTipoMovimiento().equalsIgnoreCase("Compra") || guia.getTipoMovimiento().equalsIgnoreCase("Ingreso")) {
                producto.setStock(producto.getStock() + cantidadMovimiento);
            } else if (guia.getTipoMovimiento().equalsIgnoreCase("Venta") || guia.getTipoMovimiento().equalsIgnoreCase("Salida")) {
                if (producto.getStock() < cantidadMovimiento) {
                    throw new RuntimeException("Stock insuficiente en Inventario para " + nombreProducto + ". Disponible: " + producto.getStock());
                }
                producto.setStock(producto.getStock() - cantidadMovimiento);
            }
            
            // 3. Enviamos un PUT remoto para actualizar el stock modificado en el microservicio de inventario
            inventoryWebClient.put()
                    .uri("/{id}", producto.getId())
                    .body(Mono.just(producto), ProductoDTO.class)
                    .retrieve()
                    .bodyToMono(ProductoDTO.class)
                    .block();
        }

        // 4. Guardar el historial local de la guía en la tabla 'guia_almacen'
        return guiaRepository.save(guia);
    }

    @Transactional
    public GuiaAlmacen actualizar(Long id, GuiaAlmacen guiaDetalles) {
        GuiaAlmacen staticGuia = guiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guía no encontrada con id: " + id));
        staticGuia.setNroGuia(guiaDetalles.getNroGuia());
        staticGuia.setTipoMovimiento(guiaDetalles.getTipoMovimiento());
        staticGuia.setEncargado(guiaDetalles.getEncargado());
        staticGuia.setMotivo(guiaDetalles.getMotivo());
        return guiaRepository.save(staticGuia);
    }

    @Transactional
    public void eliminar(Long id) {
        guiaRepository.deleteById(id);
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
        } catch (Exception e) {
            return "Error al parsear";
        }
        return "N/A";
    }
}