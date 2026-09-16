# ESP32 — Cableado y asignación de pines

Este documento resume el cableado deducido **directamente del firmware actual** en `esp32/src/config.h` y módulos relacionados.

## Resumen rápido de pines (tabla principal)

| Componente / Señal | GPIO ESP32 | Alimentación (VCC) | GND | Interfaz / tipo de señal | Estado en código | Notas |
|---|---:|---|---|---|---|---|
| Relé de bomba (`PIN_BOMBA`) | GPIO 26 | Módulo de relé: **por confirmar** (típicamente 5V o 3.3V según módulo) | Común con ESP32 | Salida digital (control relé) | `BOMBA_ACTIVE_HIGH=false` (activo en LOW) | El firmware energiza relé solo cuando riego está ON (`BOMBA_CONTACTO_NC=false`). |
| Malla abrir (`PIN_MALLA_ABRIR`) | GPIO 27 | Driver/relé de motor: **por confirmar** | Común con ESP32 | Salida digital (dirección abrir) | `MALLA_ACTIVE_HIGH=true` | Se usa junto con GPIO 14 para motor bidireccional. |
| Malla cerrar (`PIN_MALLA_CERRAR`) | GPIO 14 | Driver/relé de motor: **por confirmar** | Común con ESP32 | Salida digital (dirección cerrar) | `MALLA_ACTIVE_HIGH=true` | Pin de strapping (arranque); ver advertencias. |
| LED de estado (`PIN_LED_STATUS`) | GPIO 2 | 3.3V lógico ESP32 | Común con ESP32 | Salida digital | En reposo LOW, parpadea en actividad | Puede ser LED integrado o externo (**por confirmar** físico). GPIO2 también es pin de arranque. |
| SHT31 SDA (`PIN_I2C_SDA`) | GPIO 21 | 3.3V recomendado | Común con ESP32 | I2C (SDA) | `Wire.begin(21,22)` | Dirección usada en firmware principal: `0x44`. |
| SHT31 SCL (`PIN_I2C_SCL`) | GPIO 22 | 3.3V recomendado | Común con ESP32 | I2C (SCL) | `Wire.begin(21,22)` | Requiere pull-up I2C (normalmente incluidos en módulo breakout). |
| SHT10 DATA (`PIN_SHT10_DATA`) | GPIO 18 | 3.3V | Común con ESP32 | Señal digital DATA (SHT1x) | `SHT1x(PIN_SHT10_DATA, PIN_SHT10_CLK)` | Verificar si el módulo trae resistencias necesarias. |
| SHT10 CLK (`PIN_SHT10_CLK`) | GPIO 19 | 3.3V | Común con ESP32 | Señal digital CLK (SHT1x) | `SHT1x(PIN_SHT10_DATA, PIN_SHT10_CLK)` | Cableado corto recomendado para estabilidad. |

## Esquema textual / ASCII de referencia

```text
                 +---------------- ESP32 (esp32dev) ----------------+
                 |                                                    |
Sensor SHT31     | GPIO21 (SDA) <-------------------- SDA            |
(aire)           | GPIO22 (SCL) <-------------------- SCL            |
                 | 3V3        ---------------------> VCC (3.3V)      |
                 | GND        ---------------------> GND             |
                 |                                                    |
Sensor SHT10     | GPIO18 (DATA) <------------------- DATA           |
(suelo)          | GPIO19 (CLK)  -------------------> CLK            |
                 | 3V3         ---------------------> VCC (3.3V)     |
                 | GND         ---------------------> GND            |
                 |                                                    |
Relé bomba       | GPIO26      ---------------------> IN (relé)      |
                 | GND         ---------------------> GND relé       |
                 | (VCC relé: por confirmar 3.3V/5V según módulo)    |
                 |                                                    |
Driver/relés     | GPIO27      ---------------------> IN abrir       |
motor malla      | GPIO14      ---------------------> IN cerrar      |
                 | GND         ---------------------> GND driver      |
                 | (VCC driver: por confirmar)                        |
                 |                                                    |
LED estado       | GPIO2       ---------------------> LED (externo?) |
                 +----------------------------------------------------+
```

## Detalle de conexión por componente

### 1) Bomba de agua (relé)
- Pin de control: `GPIO26`.
- Lógica configurada:
  - `BOMBA_ACTIVE_HIGH=false` → el relé es activo en **LOW**.
  - `BOMBA_CONTACTO_NC=false` → el relé solo se energiza cuando la app pide encender la bomba.
- **Por confirmar**:
  - Modelo exacto de módulo de relé.
  - Si su VCC de control es 3.3V o 5V.
  - Tipo de contacto cableado a bomba (NO/NC físico).

### 2) Malla sombra (motor bidireccional)
- Pines de control:
  - `GPIO27`: abrir.
  - `GPIO14`: cerrar.
- El firmware activa una dirección por tiempo fijo (`MALLA_ACTUACION_MS=5000`) y luego desactiva ambos pines.
- **Por confirmar**:
  - Etapa de potencia exacta (puente H, doble relé, driver comercial, etc.).
  - Tensión/corriente del motor y fuente separada.

### 3) Sensor SHT31 (aire)
- Bus I2C:
  - SDA `GPIO21`
  - SCL `GPIO22`
- Dirección usada por firmware principal: `0x44`.
- Alimentación esperada: 3.3V y GND común.

### 4) Sensor SHT10 (suelo)
- Interfaz digital SHT1x:
  - DATA `GPIO18`
  - CLK `GPIO19`
- Alimentación esperada: 3.3V y GND común.

### 5) LED de estado
- Pin: `GPIO2`.
- Comportamiento:
  - Reposo: apagado.
  - Actividad (bomba/malla): parpadeo.
- **Por confirmar**: si se usa LED onboard del módulo ESP32 o LED externo.

## Advertencias eléctricas y de diseño (importantes)

1. **Niveles lógicos del ESP32: 3.3V**
   - No inyectar 5V directo a GPIO.
   - Si un módulo de relé/driver usa lógica de 5V no tolerante a 3.3V, usar adaptación adecuada.

2. **Tierras comunes**
   - ESP32, sensores y módulos de control deben compartir **GND común** para referencia de señal.

3. **Relés, bomba y motor malla**
   - La carga de potencia (bomba/motor) debe alimentarse con fuente adecuada y aislada del ESP32 cuando sea posible.
   - Usar protección contra transientes (diodo flyback/etapa adecuada), especialmente en cargas inductivas.

4. **Pines de arranque (strapping) en uso**
   - `GPIO2` (LED estado) y `GPIO14` (malla cerrar) son sensibles durante boot.
   - Evitar que hardware externo fuerce niveles conflictivos al arrancar, para no impedir el boot.

5. **I2C y pull-ups**
   - SDA/SCL necesitan resistencias pull-up a 3.3V (muchos módulos SHT31 ya las incluyen).

6. **Pull-up/pull-down adicionales**
   - El firmware no configura pull-ups/pull-down internos explícitos para actuadores/sensores.
   - Si hay ruido o falsos disparos en entradas de módulos externos, considerar acondicionamiento físico.

## Trazabilidad en código

Definiciones base en:
- `esp32/src/config.h`

Uso de pines en:
- `esp32/src/actuators.cpp`
- `esp32/src/sensors.cpp`
- `esp32/src/sensors_test.cpp`
- `esp32/src/pump_relay_test.cpp`
