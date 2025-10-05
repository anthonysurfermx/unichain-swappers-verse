# 🚀 Quick Start Guide

## ⚠️ IMPORTANTE: UNICHAIN MAINNET

Este proyecto usa **Unichain Mainnet** (Chain ID 130), NO testnet. Necesitarás **ETH REAL**.

## 1. Obtener WalletConnect Project ID

1. Ve a https://cloud.walletconnect.com
2. Crea una cuenta / Inicia sesión
3. Crea un nuevo proyecto
4. Copia el Project ID

## 2. Configurar Variables de Entorno

Edita el archivo `.env`:

```bash
VITE_WALLETCONNECT_PROJECT_ID="tu_project_id_aqui"
```

## 3. Instalar Dependencias

```bash
npm install
```

## 4. Deployar el Smart Contract

### Opción A: Usando Remix (Recomendado)

1. Abre https://remix.ethereum.org
2. Crea un archivo `PredictionMarket.sol`
3. Copia el contenido de `contracts/PredictionMarket.sol`
4. Compila con Solidity 0.8.20+
5. Conecta MetaMask a **Unichain Mainnet**:
   - Network: Unichain
   - RPC: https://mainnet.unichain.org
   - Chain ID: **130** (MAINNET)
6. Deploy con estos parámetros:
   - `_question`: "El grupo de Telegram de Uniswap llegará a 1,000 miembros antes del 31 de Octubre 2025?"
   - `_endTime`: 1730419199 (timestamp para Oct 31, 2025)
7. **Confirma la transacción (ESTO COSTARÁ ETH REAL)**
8. **Copia la dirección del contrato desplegado**

### Opción B: Usar un contrato ya desplegado

Si ya existe uno desplegado, usa esa dirección.

## 5. Actualizar Dirección del Contrato

Edita `src/config/contract.ts`:

```typescript
export const PREDICTION_MARKET_ADDRESS = '0xTU_DIRECCION_AQUI' as `0x${string}`;
```

## 6. Obtener ETH en Unichain Mainnet

Necesitas ETH en Unichain Mainnet:

### Opción 1: Bridge desde Ethereum
1. Ve a https://bridge.unichain.org
2. Conecta tu wallet
3. Bridge ETH desde Ethereum Mainnet a Unichain Mainnet

### Opción 2: Obtener en un Exchange
Algunos exchanges soportan retiros directos a Unichain

## 7. Correr el Proyecto

```bash
npm run dev
```

Abre http://localhost:5173

## 8. Usar la Aplicación

1. Click en "Connect"
2. Selecciona tu wallet (MetaMask, Rainbow, etc.)
3. Asegúrate de estar en Unichain Sepolia
4. Compra shares de YES o NO
5. Observa cómo cambian las probabilidades en tiempo real

## ✅ Checklist Rápido

- [ ] WalletConnect Project ID agregado a `.env`
- [ ] Dependencias instaladas
- [ ] MetaMask configurado para **Unichain Mainnet (Chain ID 130)**
- [ ] ETH REAL en tu wallet en Unichain Mainnet
- [ ] Contrato desplegado en Remix
- [ ] Dirección del contrato actualizada en `src/config/contract.ts`
- [ ] App corriendo en `npm run dev`

## 🆘 Troubleshooting

### Error: "Chain not configured"
- Asegúrate de tener Unichain Mainnet agregado a tu wallet
- Chain ID debe ser **130** (MAINNET, no 1301)

### Error: "Insufficient funds"
- Necesitas ETH REAL en Unichain Mainnet
- Bridge desde Ethereum en https://bridge.unichain.org

### No se conecta la wallet
- Verifica que `VITE_WALLETCONNECT_PROJECT_ID` esté configurado
- Reinicia el servidor de desarrollo

### Transacción falla
- Asegúrate de tener suficiente ETH para gas
- Verifica que estés en la red correcta (Chain ID 130)
- Recuerda que esto es MAINNET - usas ETH real

## 📚 Más Info

- Ver [README.md](./README.md) para documentación completa
- Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guía detallada de deployment

---

¡Listo para predecir! 🎯
