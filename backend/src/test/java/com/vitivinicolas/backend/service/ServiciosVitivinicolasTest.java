package com.vitivinicolas.backend.service;
import com.vitivinicolas.backend.model.*;
import com.vitivinicolas.backend.repository.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;


public class ServiciosVitivinicolasTest {

    
    // MOCKS PARA CAJA 
    
    @InjectMocks  
    private CajaService cajaService;

    @Mock 
    private MovimientoCajaRepository movimientoCajaRepository;

   
    // MOCKS PARA CUENTAS BANCARIAS 
    
    @InjectMocks
    private CuentaBancariaService cuentaBancariaService;

    @Mock
    private CuentaBancariaRepository cuentaBancariaRepository;

    
    // MOCKS 
    
    @InjectMocks
    private ReporteService reporteService;

    @Mock
    private ReporteRepository reporteRepository;

    @Mock  // para productos en reportes de almacén
    private ProductoRepository productoRepository;

    // Configuración inicial antes de cada prueba
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);  // Inicializa todos los mocks
    }

    
    // CP-CJ-REG-01: Validar registro de movimiento de caja
    
    @Test
    public void testCP_CJ_REG_01_RegistrarMovimientoCaja() {
        // ESCENARIO: Crear un movimiento de caja de prueba
        MovimientoCaja movimiento = new MovimientoCaja();
        movimiento.setTipo("Deposito");  
        movimiento.setCuenta("Caja Principal");
        movimiento.setMonto(new BigDecimal("1000.00"));
        movimiento.setFecha(LocalDate.now());
        movimiento.setMotivo("Prueba de registro de movimiento");

        // CONFIGURACIÓN MOCK: Simular guardado exitoso del movimiento
        Mockito.when(movimientoCajaRepository.save(Mockito.any(MovimientoCaja.class)))
               .thenReturn(movimiento);

        // ACCIÓN: Registrar el movimiento a través del servicio
        MovimientoCaja resultado = cajaService.registrarMovimiento(movimiento);

        // VERIFICACIÓN: Validar que los datos se guardaron correctamente
        Assertions.assertNotNull(resultado);
        Assertions.assertEquals("Deposito", resultado.getTipo());
        Assertions.assertEquals("Caja Principal", resultado.getCuenta());
        Assertions.assertEquals(0, new BigDecimal("1000.00").compareTo(resultado.getMonto()));
        Assertions.assertEquals("Prueba de registro de movimiento", resultado.getMotivo());
        
        // VERIFICACIÓN: Confirmar que el repositorio se llamó una sola vez
        Mockito.verify(movimientoCajaRepository, Mockito.times(1)).save(movimiento);
    }

    
    // CP-CJ-CAL-01: Validar cálculo de ingresos, retiros y saldo
   
    @Test
    public void testCP_CJ_CAL_01_CalcularIngresosRetirosSaldo() {
        // ESCENARIO: Crear movimientos mixtos (depósitos y retiros)
        MovimientoCaja deposito1 = new MovimientoCaja();
        deposito1.setTipo("Deposito");  
        deposito1.setMonto(new BigDecimal("1000.00"));

        MovimientoCaja deposito2 = new MovimientoCaja();
        deposito2.setTipo("Deposito");  
        deposito2.setMonto(new BigDecimal("500.00"));

        MovimientoCaja retiro = new MovimientoCaja();
        retiro.setTipo("Retiro");
        retiro.setMonto(new BigDecimal("300.00"));

        List<MovimientoCaja> movimientos = Arrays.asList(deposito1, deposito2, retiro);

        // CONFIGURACIÓN MOCK: Simular obtención de todos los movimientos
        Mockito.when(movimientoCajaRepository.findAll()).thenReturn(movimientos);

        // ACCIÓN: Calcular totales y saldo
        Double totalIngresos = cajaService.calcularIngresos();
        Double totalRetiros = cajaService.calcularRetiros();
        Double saldoCaja = cajaService.calcularSaldo();

        // VERIFICACIÓN: Validar cálculos matemáticos
        Assertions.assertEquals(1500.00, totalIngresos);
        Assertions.assertEquals(300.00, totalRetiros);
        Assertions.assertEquals(1200.00, saldoCaja);
    }

    
    // CP-CB-REG-01: Validar registro de cuenta bancaria
    
    @Test
    public void testCP_CB_REG_01_RegistrarCuentaBancaria() {
        // ESCENARIO: Crear una cuenta bancaria de prueba
        CuentaBancaria cuenta = new CuentaBancaria();
        cuenta.setNombreBanco("BCP");
        cuenta.setTipoCuenta("Cuenta Corriente");
        cuenta.setNumeroCuenta("001-123");
        cuenta.setSaldo(new BigDecimal("5000.00"));
        cuenta.setMoneda("CLP");
        cuenta.setFechaApertura(LocalDate.now());
        cuenta.setTitular("Empresa Vitivinícola");

        // CONFIGURACIÓN MOCK: Simular guardado exitoso de la cuenta
        Mockito.when(cuentaBancariaRepository.save(Mockito.any(CuentaBancaria.class)))
               .thenReturn(cuenta);

        // ACCIÓN: Registrar la cuenta
        CuentaBancaria resultado = cuentaBancariaService.registrarCuenta(cuenta);

        // VERIFICACIÓN: Validar que los datos se guardaron correctamente
        Assertions.assertNotNull(resultado);
        Assertions.assertEquals("BCP", resultado.getNombreBanco());
        Assertions.assertEquals("Cuenta Corriente", resultado.getTipoCuenta());
        Assertions.assertEquals("001-123", resultado.getNumeroCuenta());
        Assertions.assertEquals(0, new BigDecimal("5000.00").compareTo(resultado.getSaldo()));
        
        // VERIFICACIÓN: Confirmar que se guardó una sola vez
        Mockito.verify(cuentaBancariaRepository, Mockito.times(1)).save(cuenta);
    }

   
    // CP-RP-GEN-01: Generar reporte de CAJA
    
    @Test
    public void testCP_RP_GEN_01_GenerarReporteCaja() {
        // ESCENARIO: Crear movimientos de caja para el reporte
        MovimientoCaja deposito = new MovimientoCaja();
        deposito.setTipo("Deposito");  
        deposito.setMonto(new BigDecimal("1200.00"));

        MovimientoCaja retiro = new MovimientoCaja();
        retiro.setTipo("Retiro");
        retiro.setMonto(new BigDecimal("350.00"));

        List<MovimientoCaja> movimientos = Arrays.asList(deposito, retiro);

        // CONFIGURACIÓN MOCK: Simular datos y guardado de reporte
        Mockito.when(movimientoCajaRepository.findAll()).thenReturn(movimientos);
        Mockito.when(reporteRepository.save(Mockito.any(Reporte.class)))
               .thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(reporteRepository.count()).thenReturn(0L);

        // ACCIÓN: Generar reporte de caja
        Reporte reporte = reporteService.generarReporte("Caja", "Administrador");
        
        // VERIFICACIÓN: Validar contenido y cálculos del reporte
        Assertions.assertNotNull(reporte);
        Assertions.assertEquals("Caja", reporte.getTipo());
        Assertions.assertEquals("Generado", reporte.getEstado());
        Assertions.assertEquals(1200.00, reporte.getTotalIngresos());
        Assertions.assertEquals(350.00, reporte.getTotalEgresos());
        Assertions.assertEquals(850.00, reporte.getSaldoFinal());
        Assertions.assertTrue(reporte.getContenido().contains("REPORTE DE CAJA"));
    }

    
    // CP-RP-GEN-01: Generar reporte de ALMACEN
    
    @Test
    public void testCP_RP_GEN_01_GenerarReporteAlmacen() {
        // ESCENARIO: Crear productos con diferentes niveles de stock
        Producto producto1 = new Producto();
        producto1.setStock(45);
        
        Producto producto2 = new Producto();
        producto2.setStock(5); // Stock crítico

        List<Producto> productos = Arrays.asList(producto1, producto2);

        // CONFIGURACIÓN MOCK: Simular consulta de productos
        Mockito.when(productoRepository.findAll()).thenReturn(productos);
        Mockito.when(reporteRepository.save(Mockito.any(Reporte.class)))
               .thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(reporteRepository.count()).thenReturn(0L);

        // ACCIÓN: Generar reporte de almacén
        Reporte reporte = reporteService.generarReporte("Almacen", "Jefe de almacén");

        // VERIFICACIÓN: Validar estadísticas de inventario
        Assertions.assertNotNull(reporte);
        Assertions.assertEquals("Almacen", reporte.getTipo());
        Assertions.assertEquals(2, reporte.getTotalProductos());
        Assertions.assertEquals(1, reporte.getProductosCriticos());
        Assertions.assertTrue(reporte.getContenido().contains("REPORTE DE ALMACEN"));
    }

    
    // CP-RP-GEN-01: Generar reporte de CUENTAS
    
    @Test
    public void testCP_RP_GEN_01_GenerarReporteCuentas() {
        // ESCENARIO: Crear cuentas bancarias con diferentes saldos
        CuentaBancaria cuenta1 = new CuentaBancaria();
        cuenta1.setSaldo(new BigDecimal("80000.00"));
        
        CuentaBancaria cuenta2 = new CuentaBancaria();
        cuenta2.setSaldo(new BigDecimal("44500.00"));

        List<CuentaBancaria> cuentas = Arrays.asList(cuenta1, cuenta2);

        // CONFIGURACIÓN MOCK: Simular obtención de cuentas
        Mockito.when(cuentaBancariaRepository.findAll()).thenReturn(cuentas);
        Mockito.when(reporteRepository.save(Mockito.any(Reporte.class)))
               .thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(reporteRepository.count()).thenReturn(0L);

        // ACCIÓN: Generar reporte de cuentas bancarias
        Reporte reporte = reporteService.generarReporte("Cuentas", "Dueño");

        // VERIFICACIÓN: Validar consolidado de cuentas
        Assertions.assertNotNull(reporte);
        Assertions.assertEquals("Cuentas", reporte.getTipo());
        Assertions.assertEquals(2, reporte.getTotalCuentas());
        Assertions.assertEquals(124500.00, reporte.getSaldoTotalCuentas());
        Assertions.assertTrue(reporte.getContenido().contains("REPORTE DE CUENTAS BANCARIAS"));
    }

    
    // CP-RP-GEN-01: Listar y filtrar reportes
    
    @Test
    public void testCP_RP_GEN_01_ListarYFiltrarReportes() {
        // ESCENARIO: Crear múltiples reportes de diferentes tipos
        Reporte reporte1 = new Reporte();
        reporte1.setTipo("Caja");
        
        Reporte reporte2 = new Reporte();
        reporte2.setTipo("Almacen");
        
        Reporte reporte3 = new Reporte();
        reporte3.setTipo("Caja");

        List<Reporte> reportes = Arrays.asList(reporte1, reporte2, reporte3);

        // CONFIGURACIÓN MOCK: Simular búsqueda ordenada de reportes
        Mockito.when(reporteRepository.findAllByOrderByFechaDesc()).thenReturn(reportes);

        // ACCIÓN: Obtener todos los reportes
        List<Reporte> todos = reporteService.getAllReportes();

        // VERIFICACIÓN: Validar cantidad total de reportes
        Assertions.assertEquals(3, todos.size());
    }

    
    // TEST ADICIONAL: Listar movimientos de caja
    
    @Test
    public void testListarMovimientosCaja() {
        // ESCENARIO: Crear movimientos de caja variados
        MovimientoCaja movimiento1 = new MovimientoCaja();
        movimiento1.setTipo("Deposito");
        movimiento1.setMonto(new BigDecimal("1000.00"));

        MovimientoCaja movimiento2 = new MovimientoCaja();
        movimiento2.setTipo("Retiro");
        movimiento2.setMonto(new BigDecimal("300.00"));

        List<MovimientoCaja> movimientos = Arrays.asList(movimiento1, movimiento2);

        // CONFIGURACIÓN MOCK: Simular obtención de todos los movimientos
        Mockito.when(movimientoCajaRepository.findAll()).thenReturn(movimientos);

        // ACCIÓN: Listar movimientos de caja
        List<MovimientoCaja> resultado = cajaService.listarMovimientos();

        // VERIFICACIÓN: Validar el listado completo
        Assertions.assertEquals(2, resultado.size());
        Assertions.assertEquals("Deposito", resultado.get(0).getTipo());
        Assertions.assertEquals("Retiro", resultado.get(1).getTipo());
    }

    
    // TEST ADICIONAL: Listar cuentas bancarias
    
    @Test
    public void testListarCuentasBancarias() {
        // ESCENARIO: Crear cuentas bancarias de diferentes bancos
        CuentaBancaria cuenta1 = new CuentaBancaria();
        cuenta1.setNombreBanco("BCP");
        
        CuentaBancaria cuenta2 = new CuentaBancaria();
        cuenta2.setNombreBanco("BBVA");

        List<CuentaBancaria> cuentas = Arrays.asList(cuenta1, cuenta2);

        // CONFIGURACIÓN MOCK: Simular obtención de todas las cuentas
        Mockito.when(cuentaBancariaRepository.findAll()).thenReturn(cuentas);

        // ACCIÓN: Listar cuentas bancarias
        List<CuentaBancaria> resultado = cuentaBancariaService.listarCuentas();

        // VERIFICACIÓN: Validar el listado completo
        Assertions.assertEquals(2, resultado.size());
        Assertions.assertEquals("BCP", resultado.get(0).getNombreBanco());
        Assertions.assertEquals("BBVA", resultado.get(1).getNombreBanco());
    }
}