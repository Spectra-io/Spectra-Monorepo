# ZK Circuits

Esta carpeta contiene los circuitos Zero Knowledge escritos en Circom.

## Circuitos a implementar

### 1. age_check.circom
Prueba que el usuario es mayor de 18 años sin revelar la fecha de nacimiento exacta.

### 2. nationality.circom
Prueba que el usuario es de nacionalidad argentina sin revelar otros datos.

### 3. unique_identity.circom
Prueba que el DNI es único sin revelar el número de DNI.

## Setup

1. Instalar Circom: https://docs.circom.io/getting-started/installation/
2. Compilar circuitos: `circom circuit.circom --r1cs --wasm --sym`
3. Generar trusted setup (Powers of Tau)
4. Generar verification keys

## Archivos necesarios

```
circuits/
├── age_check.circom
├── nationality.circom
├── unique_identity.circom
├── compiled/
│   ├── age_check.wasm
│   ├── nationality.wasm
│   └── unique_identity.wasm
└── keys/
    ├── age_verification_key.json
    ├── nationality_verification_key.json
    └── identity_verification_key.json
```
